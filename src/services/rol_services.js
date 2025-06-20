import axios from "axios";
import { LISTAR_ROL, OBTENER_ROL,PERMISOS_ROL } from "../const/endpoint/rol/rol_endpoint";
import { ASIGNAR_PERMISO } from "../const/endpoint/rol/permisos/permisos_endpoint";

export const listarRoles = async () => {
  try {
    const response = await axios.get(LISTAR_ROL);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje ||
      "Error al listar  las roles",
    );
  }
};


export const listarRoles_completo = async () => {
  try {
    const response = await axios.get(OBTENER_ROL);
    return response.data;
  } catch (error) {
    console.error('Error en listarRoles_completo:', error);
    throw error;
  }
};


export const obtenerPermisosRol = async (rolId) => {
  try {
    const response = await axios.get(`${PERMISOS_ROL}?rol_id=${rolId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje || "Error al obtener los permisos del rol"
    );
  }
};


export const asignarPermisos = async (rolId, permisosIds) => {
  try {
    const response = await axios.post(ASIGNAR_PERMISO, {
      rol_id: rolId,
      permisos: permisosIds
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje || "Error al asignar los permisos"
    );
  }
};