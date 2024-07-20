import Role from "../models/role.model.js";
import User from "../models/user.model.js";

/**
 * Crea los roles por defecto en la base de datos.
 * @async
 * @function createRoles
 * @returns {Promise<void>}
 */
async function createRoles() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count > 0) return;

    await Promise.all([
      new Role({ name: "user" }).save(),
      new Role({ name: "admin" }).save(),
    ]);
    console.log("* => Roles creados exitosamente");
  } catch (error) {
    console.error("Error al crear roles:", error);
  }
}

/**
 * Crea los usuarios por defecto en la base de datos.
 * @async
 * @function createUsers
 * @returns {Promise<void>}
 */
async function createUsers() {
  try {
    const count = await User.estimatedDocumentCount();
    if (count > 0) return;

    const admin = await Role.findOne({ name: "admin" });
    const user = await Role.findOne({ name: "user" });

    if (!admin || !user) {
      throw new Error("No se encontraron los roles necesarios");
    }

    await Promise.all([
      new User({
        username: "user",
        email: "user@email.com",
        rut: "12345678-9",
        password: await User.encryptPassword("user123"),
        roles: [user._id], // Asigna el rol de "user"
      }).save(),
      new User({
        username: "admin",
        email: "admin@email.com",
        rut: "12345678-0",
        password: await User.encryptPassword("admin123"),
        roles: [admin._id], // Asigna el rol de "admin"
      }).save(),
    ]);
    console.log("* => Users creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createRoles, createUsers };
