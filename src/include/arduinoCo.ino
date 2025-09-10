#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <DHT_U.h>

// ===== CONFIG WIFI =====
const char* ssid = "JOEL";
const char* password = "carbajal25";

// ===== SERVIDOR WEB =====
ESP8266WebServer server(80);

// ===== CONFIG SENSORES =====
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

int sensorPin = A0;
int relayPin = 5;    // D1 = GPIO5 → ¡AHORA ACTIVO EN HIGH!
int modoPin = 4;     // Botón cambio de modo
int manualPin = 14;  // Botón encendido manual

// ===== VARIABLES RIEGO =====
int threshold = 40;  // Humedad mínima para regar
bool modoAutomatico = true;
bool bombaEncendida = false;
bool enEspera = false;
bool controlWeb = false;  

unsigned long tiempoRiego = 10000;   // 10s
unsigned long tiempoEspera = 20000;  // 20s
unsigned long ultimaActivacionBomba = 0;

// ===== VARIABLES SENSORES =====
float temperatura = 0.0;
float humedadAmbiental = 0.0;
int humedadSuelo = 0;
unsigned long ultimaLecturaSensores = 0;
const unsigned long intervaloLectura = 2000;  // 2 segundos

// ===== BOTONES DEBOUNCE =====
unsigned long lastButtonModoDebounce = 0;
unsigned long lastButtonManualDebounce = 0;
const unsigned long debounceDelay = 50;

bool lastModoButtonState = HIGH;
bool lastManualButtonState = HIGH;

void debugPrint(String message) {
  Serial.print("[DEBUG] ");
  Serial.println(message);
}

// 🔌 FUNCIONES DE CONTROL DE BOMBA — AJUSTADAS A TU HARDWARE REAL
void encenderBomba() {
  digitalWrite(relayPin, HIGH);   // En TU HARDWARE, HIGH enciende la bomba
  bombaEncendida = true;
  debugPrint("💧 Bomba ENCENDIDA físicamente (Pin HIGH)");
}

void apagarBomba() {
  digitalWrite(relayPin, LOW);    // En TU HARDWARE, LOW apaga la bomba
  bombaEncendida = false;
  debugPrint("💤 Bomba APAGADA físicamente (Pin LOW)");
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  debugPrint("Iniciando Sistema de Riego Web...");

  pinMode(sensorPin, INPUT);
  pinMode(relayPin, OUTPUT);
  pinMode(modoPin, INPUT_PULLUP);
  pinMode(manualPin, INPUT_PULLUP);

  apagarBomba();  // Inicia con bomba apagada (pin en LOW)
  dht.begin();

  // Conectar WiFi
  Serial.println("Conectando a WiFi...");
  WiFi.begin(ssid, password);

  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 30) {
    delay(500);
    Serial.print(".");
    intentos++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ Conectado a WiFi");
    Serial.print("🌍 IP del ESP8266: ");
    Serial.println(WiFi.localIP());
    Serial.println("==========================================");
    Serial.print("🌐 Accede desde tu navegador: http://");
    Serial.println(WiFi.localIP());
    Serial.println("📱 Usa esta IP");
    Serial.println("==========================================");
  } else {
    Serial.println("\n❌ Error: No se pudo conectar al WiFi");
    return;
  }

  // Configurar rutas del servidor web
  setupWebServer();

  server.begin();
  debugPrint("🌐 Servidor web iniciado en puerto 80");
}

void setupWebServer() {
  server.on("/api/datos", HTTP_GET, handleGetDatos);
  server.on("/api/datos", HTTP_OPTIONS, handleOptions);

  server.on("/api/bomba", HTTP_POST, handleBomba);
  server.on("/api/bomba", HTTP_OPTIONS, handleOptions);

  server.on("/api/config", HTTP_POST, handleConfig);
  server.on("/api/config", HTTP_OPTIONS, handleOptions);

  server.on("/api/texto", HTTP_POST, handleTexto);
  server.on("/api/texto", HTTP_OPTIONS, handleOptions);

  server.onNotFound(handleNotFound);
}

void leerSensores() {
  unsigned long tiempoActual = millis();

  if (tiempoActual - ultimaLecturaSensores >= intervaloLectura) {
    ultimaLecturaSensores = tiempoActual;

    // Leer DHT11
    humedadAmbiental = dht.readHumidity();
    temperatura = dht.readTemperature();

    int raw = analogRead(sensorPin);
    humedadSuelo = map(raw, 0, 1023, 100, 0);

    static int contador = 0;
    if (contador++ % 5 == 0) {
      if (isnan(humedadAmbiental) || isnan(temperatura)) {
        debugPrint("⚠️ Error leyendo DHT11");
      } else {
        Serial.printf("📊 T:%.1f°C | H.Amb:%.1f%% | H.Suelo:%d%% | Bomba:%s\n",
                      temperatura, humedadAmbiental, humedadSuelo, bombaEncendida ? "ON" : "OFF");
      }
    }
  }
}

void controlarBomba(int humedad) {
  if (!modoAutomatico) return;  // Solo funciona en modo automático

  unsigned long tiempoActual = millis();

  // Si está en espera
  if (enEspera) {
    if (tiempoActual - ultimaActivacionBomba >= tiempoEspera) {
      enEspera = false;
      debugPrint("⏰ Período de espera finalizado");
    }
    return;
  }

  // Encender bomba si humedad es baja
  if (humedad < threshold && !bombaEncendida && !enEspera) {
    encenderBomba();
    ultimaActivacionBomba = tiempoActual;
    debugPrint("🤖 Automático: BOMBA ENCENDIDA - Humedad: " + String(humedad) + "%");
  }

  // Apagar bomba después del tiempo de riego
  if (bombaEncendida && (tiempoActual - ultimaActivacionBomba >= tiempoRiego)) {
    apagarBomba();
    enEspera = true;
    ultimaActivacionBomba = tiempoActual;
    debugPrint("🤖 Automático: BOMBA APAGADA - Iniciando espera");
  }
}

// ===== WEB SERVER HANDLERS =====

void handleOptions() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  server.sendHeader("Access-Control-Max-Age", "86400");
  server.send(200, "text/plain", "OK");
}

void handleGetDatos() {
  DynamicJsonDocument doc(1024);

  doc["humedad"] = humedadSuelo;
  doc["temperatura"] = temperatura;
  doc["humedadAmbiental"] = humedadAmbiental;
  doc["bomba"] = bombaEncendida;  // true = encendida, false = apagada
  doc["humedadMinima"] = threshold;
  doc["automatico"] = modoAutomatico;
  doc["ip"] = WiFi.localIP().toString();
  doc["timestamp"] = millis();

  doc["enEspera"] = enEspera;
  doc["tiempoEsperaRestante"] = enEspera ? (tiempoEspera - (millis() - ultimaActivacionBomba)) / 1000 : 0;
  doc["ultimoRiego"] = (millis() - ultimaActivacionBomba) / 1000;

  String response;
  serializeJson(doc, response);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  server.sendHeader("Content-Type", "application/json");

  server.send(200, "application/json", response);
}

void handleBomba() {
  if (!server.hasArg("plain")) {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(400, "application/json", "{\"error\":\"No data received\"}");
    return;
  }

  DynamicJsonDocument doc(512);
  DeserializationError error = deserializeJson(doc, server.arg("plain"));

  if (error) {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }

  bool nuevoEstado = doc["estado"];

  // 🚩 importante: desactivar automático y marcar que viene de la web
  modoAutomatico = false;
  enEspera = false;
  controlWeb = true;

  if (nuevoEstado) {
    encenderBomba();
  } else {
    apagarBomba();
  }

  DynamicJsonDocument respuesta(256);
  respuesta["success"] = true;
  respuesta["bomba"] = bombaEncendida;
  respuesta["automatico"] = modoAutomatico;

  String jsonResponse;
  serializeJson(respuesta, jsonResponse);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", jsonResponse);
}

void handleConfig() {
  if (!server.hasArg("plain")) {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(400, "application/json", "{\"error\":\"No data received\"}");
    return;
  }

  DynamicJsonDocument doc(512);
  DeserializationError error = deserializeJson(doc, server.arg("plain"));

  if (error) {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }

  if (doc.containsKey("humedadMinima")) {
    int nuevaHumedad = doc["humedadMinima"];
    if (nuevaHumedad >= 0 && nuevaHumedad <= 100) {
      threshold = nuevaHumedad;
    }
  }

  if (doc.containsKey("automatico")) {
    bool nuevoModo = doc["automatico"];
    if (nuevoModo != modoAutomatico) {
      modoAutomatico = nuevoModo;
      if (modoAutomatico) {
        enEspera = false;
      } else {
        apagarBomba();  // Asegura que la bomba esté apagada al salir de automático
      }
    }
  }

  DynamicJsonDocument respuesta(256);
  respuesta["success"] = true;
  respuesta["humedadMinima"] = threshold;
  respuesta["automatico"] = modoAutomatico;

  String jsonResponse;
  serializeJson(respuesta, jsonResponse);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", jsonResponse);
}

// ===== NUEVO HANDLER PARA TEXTO SIMPLE =====
void handleTexto() {
  if (!server.hasArg("plain")) {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(400, "application/json", "{\"error\":\"No text received\"}");
    return;
  }

  String comando = server.arg("plain");
  comando.trim();
  comando.toLowerCase();

  if (comando == "encender bomba") {
    modoAutomatico = false;
    encenderBomba();
    enEspera = false;
  } else if (comando == "apagar bomba") {
    apagarBomba();
    enEspera = false;
  } else if (comando == "cambiar modo") {
    modoAutomatico = !modoAutomatico;
    apagarBomba();
    enEspera = false;
  } else if (comando.startsWith("h")) {  // Ej: H40
    int valor = comando.substring(1).toInt();
    if (valor >= 0 && valor <= 100) threshold = valor;
  }

  DynamicJsonDocument respuesta(256);
  respuesta["success"] = true;
  respuesta["bomba"] = bombaEncendida;
  respuesta["humedadMinima"] = threshold;
  respuesta["automatico"] = modoAutomatico;

  String jsonResponse;
  serializeJson(respuesta, jsonResponse);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", jsonResponse);
}

void handleNotFound() {
  String mensaje = "Endpoint no encontrado\n\n";
  mensaje += "URI: " + server.uri() + "\n";
  mensaje += "Método: ";
  mensaje += (server.method() == HTTP_GET) ? "GET" : "POST";
  mensaje += "\n";

  server.send(404, "text/plain", mensaje);
}

void loop() {
  server.handleClient();
  leerSensores();

  bool modoButtonState = digitalRead(modoPin);
  if (modoButtonState != lastModoButtonState) {
    lastButtonModoDebounce = millis();
  }
  if ((millis() - lastButtonModoDebounce) > debounceDelay) {
    if (modoButtonState == LOW) {
      modoAutomatico = !modoAutomatico;
      apagarBomba();
      enEspera = false;
      debugPrint("🔄 Cambiado a modo: " + String(modoAutomatico ? "AUTOMÁTICO" : "MANUAL"));
    }
  }
  lastModoButtonState = modoButtonState;

  if (!modoAutomatico && !controlWeb) {
    bool manualButtonState = digitalRead(manualPin);
    if (manualButtonState != lastManualButtonState) {
      lastButtonManualDebounce = millis();
    }
    if ((millis() - lastButtonManualDebounce) > debounceDelay) {
      if (manualButtonState == LOW) {
        encenderBomba();
      } else {
        apagarBomba();
      }
    }
    lastManualButtonState = manualButtonState;
  } else {
    if (modoAutomatico) {
      controlarBomba(humedadSuelo);
    }
  }

  static unsigned long lastDebugCheck = 0;
  if (millis() - lastDebugCheck > 5000) {
    lastDebugCheck = millis();
    int pinState = digitalRead(relayPin);
    Serial.printf("[VERIFICACIÓN] Pin %d = %s, bombaEncendida = %s → %s\n",
                  relayPin,
                  pinState == HIGH ? "HIGH (Bomba debería estar ENCENDIDA)" : "LOW (Bomba debería estar APAGADA)",
                  bombaEncendida ? "true" : "false",
                  bombaEncendida ? "BOMBA ENCENDIDA" : "BOMBA APAGADA");
  }

  delay(100);
}