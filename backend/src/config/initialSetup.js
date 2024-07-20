"use strict";
// Importa el modelo de datos 'Role'
import Role from "../models/role.model.js";
import User from "../models/user.model.js";
import Alumno from "../models/alumno.model.js";

/**
 * Crea los roles por defecto en la base de datos.
 * @async
 * @function createRoles
 * @returns {Promise<void>}
 */
async function createRoles() {
  try {
    // Busca todos los roles en la base de datos
    const count = await Role.estimatedDocumentCount();
    // Si no hay roles en la base de datos los crea
    if (count > 0) return;

    await Promise.all([
      new Role({ name: "user" }).save(),
      new Role({ name: "admin" }).save(),
      new Role({ name: "alumno"}).save(),
    ]);
    console.log("* => Roles creados exitosamente");
  } catch (error) {
    console.error(error);
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
    const alumno = await Role.findOne({ name: "alumno" });

    await Promise.all([
      new User({
        username: 'user',
        email: 'user@email.com',
        rut: '12345678-9',
        password: await User.encryptPassword('user123'),
        roles: user._id,
      }).save(),
      new User({
        username: 'admin',
        email: 'admin@email.com',
        rut: '12345678-0',
        password: await User.encryptPassword('admin123'),
        roles: admin._id,
      }).save(),
      new Alumno({
        nombre: 'Juan',
        apellidos: 'Pérez',
        genero: 'masculino',
        rut: '12345678-1',
        correo: 'juan.perez@alumnos.ubiobio.cl',
        carrera: 'Ingeniería Civil',
        cursos: ['Matemáticas', 'Física'],
        areasDeInteres: ['Programación', 'Electrónica'],
        password: await Alumno.encryptPassword('alumno123'),
        roles: [alumno._id],
      }).save(),
    ]);
    console.log('* => Users y alumno creados exitosamente');
  } catch (error) {
    console.error(error);
  }
};


export { createRoles, createUsers };
