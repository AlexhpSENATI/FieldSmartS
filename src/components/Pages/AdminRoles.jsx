// src/pages/AdminRoles.jsx
import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import { changeUserRole } from "../../services/authService";
import "../../styles/AdminRoles.css";

export default function AdminRoles() {
  const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function loadUsers() {
      try {
        const snapshot = await get(ref(db, "users"));
        if (snapshot.exists()) {
          setUsers(Object.entries(snapshot.val())); // [ [uid, data], ... ]
        }
      } catch (error) {
        console.error("Error loading users:", error);
        setMessage({ text: "Error al cargar usuarios", type: "error" });
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleRoleChange = async (uid, newRole, userName) => {
    try {
      await changeUserRole(uid, newRole);
      setUsers((prev) =>
        prev.map(([id, user]) => (id === uid ? [id, { ...user, role: newRole }] : [id, user]))
      );
      setMessage({
        text: `Rol de ${userName} actualizado a ${newRole}`,
        type: "success"
      });

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    } catch (error) {
      console.error("Error changing role:", error);
      setMessage({
        text: "Error al cambiar el rol",
        type: "error"
      });
    }
  };

  // Función para obtener clase CSS según el rol
  const getRoleClass = (role) => {
    switch (role) {
      case "admin": return "role-admin";
      case "analyst": return "role-analyst";
      default: return "role-user";
    }
  };

  // if (loading) {
  //   return (
  //     <div className="admin-roles-container">
  //       <div className="loading-spinner"></div>
  //       <p>Cargando usuarios...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="admin-roles-container">
      <div className="admin-header">
        <h2>Administrar Roles de Usuario</h2>
      </div>

      {/* {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )} */}

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol Actual</th>
              <th>Cambiar Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(([uid, user]) => (
                <tr key={uid}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <span>{user.name || "Usuario sin nombre"}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${getRoleClass(user.role)}`}>
                      {user.role || "user"}
                    </span>
                  </td>
                  <td>
                    <select
                      value={user.role || "user"}
                      onChange={(e) => handleRoleChange(uid, e.target.value, user.name)}
                      className="role-select"
                    >
                      <option value="user">Usuario</option>
                      <option value="analyst">Analista</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                </tr>
              ))
            ) 
            : (
              <tr>
                <td colSpan="4" className="no-users">
                  No se encontraron usuarios
                </td>
              </tr>
            )
            }
          </tbody>
        </table>
      </div>

       {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
// // src/pages/AdminRoles.jsx
// import React, { useState, useEffect } from "react";
// import { ref, get } from "firebase/database";
// import { db } from "../../firebase";
// import { changeUserRole } from "../../services/authService";

// export default function AdminRoles() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     async function loadUsers() {
//       const snapshot = await get(ref(db, "users"));
//       if (snapshot.exists()) {
//         setUsers(Object.entries(snapshot.val())); // [ [uid, data], ... ]
//       }
//     }
//     loadUsers();
//   }, []);

//   const handleRoleChange = async (uid, newRole) => {
//     await changeUserRole(uid, newRole);
//     setUsers((prev) =>
//       prev.map(([id, user]) => (id === uid ? [id, { ...user, role: newRole }] : [id, user]))
//     );
//   };

//   return (
//     <div>
//       <h2>Administrar Roles</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Nombre</th>
//             <th>Email</th>
//             <th>Rol</th>
//             <th>Acción</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map(([uid, user]) => (
//             <tr key={uid}>
//               <td>{user.name}</td>
//               <td>{user.email}</td>
//               <td>{user.role}</td>
//               <td>
//                 <select
//                   value={user.role}
//                   onChange={(e) => handleRoleChange(uid, e.target.value)}
//                 >
//                   <option value="user">Usuario</option>
//                   <option value="analyst">Analista</option>
//                   <option value="admin">Administrador</option>
//                 </select>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
