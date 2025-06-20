import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { useApp } from "../../../store/AppContext";
import BackPage from "../components/BackPage";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { crearMantenimiento, actualizarEstadoMantenimiento } from "../../../services/mantenimiento_services";
import { listarCoordinadores } from "../../../services/utils_service";
import { listarSedes } from "../../../services/sedes_service";

export default function FormularioMantenimientoFreezer() {
  const { usuario } = useApp();
  const location = useLocation();
  const mantenimientoEdit = location.state?.mantenimiento;
  const [coordinadores, setCoordinadores] = useState([]);
  const [loadingCoordinadores, setLoadingCoordinadores] = useState(false);
  const [sedes, setSedes] = useState([]);
  const [loadingSedes, setLoadingSedes] = useState(false);
  useEffect(() => {
    if (mantenimientoEdit) {
      setFormData(mantenimientoEdit);
    }
  }, [mantenimientoEdit]);

  const handleRemoveImage = () => {
    setFormData({ ...formData, imagen: "" });
    const fileInput = document.getElementById('imagen');
    if (fileInput) fileInput.value = '';
  };
  useEffect(() => {
    const cargarCoordinadores = async () => {
      setLoadingCoordinadores(true);
      try {
        const data = await listarCoordinadores();
        setCoordinadores(data);
      } catch (error) {
        console.error("Error al cargar coordinadores:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los coordinadores",
        });
      } finally {
        setLoadingCoordinadores(false);
      }
    };

    cargarCoordinadores();
  }, []);
  useEffect(() => {
    const cargarSedes = async () => {
      setLoadingSedes(true);
      try {
        const data = await listarSedes();
        setSedes(data);
      } catch (error) {
        console.error("Error al cargar sedes:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las sedes",
        });
      } finally {
        setLoadingSedes(false);
      }
    };

    cargarSedes();
  }, []);
  const [formData, setFormData] = useState({
    titulo: "",
    codigo: "",
    modelo: "",
    dependencia: "",
    sede_id: "",
    nombre_receptor: "",
    imagen: "",
    descripcion: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imagen: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const datosConUsuario = {
      ...formData,
      creado_por: usuario?.id,
    };

    try {
      if (mantenimientoEdit?.id) {
        await actualizarEstadoMantenimiento(mantenimientoEdit.id, datosConUsuario);
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "Mantenimiento actualizado correctamente",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await crearMantenimiento(datosConUsuario);
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Mantenimiento registrado correctamente",
          timer: 2000,
          showConfirmButton: false,
        });

        // Limpieza completa de todos los campos
        setFormData({
          titulo: "",
          codigo: "",
          modelo: "",
          dependencia: "",
          sede_id: "",
          nombre_receptor: "",
          imagen: "",
          descripcion: "",
        });

        // Limpiar también el input de archivo (necesario para permitir subir la misma imagen otra vez)
        const fileInput = document.getElementById('imagen');
        if (fileInput) {
          fileInput.value = '';
        }
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo registrar el mantenimiento",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-3xl space-y-6 shadow-2xl shadow-blue-100/50 border border-gray-100"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {mantenimientoEdit ? "Editar" : "Registrar"} Mantenimiento IPS
        </h2>
        <p className="text-gray-500 text-sm">Complete todos los campos requeridos <span className="text-red-500">*</span></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Campos básicos con efecto glassmorphism */}
        {["titulo", "codigo", "modelo", "dependencia"].map((campo, i) => (
          <motion.div
            key={campo}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col gap-2"
          >
            <label
              htmlFor={campo}
              className="text-sm font-medium text-gray-700 capitalize flex items-center gap-1"
            >
              {campo.replace(/_/g, " ")}
              {["titulo", "dependencia"].includes(campo) && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                id={campo}
                name={campo}
                value={formData[campo]}
                onChange={handleChange}
                className="w-full bg-gray-50/70 backdrop-blur-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-200/80 shadow-sm transition-all duration-200 hover:border-blue-300"
                placeholder={campo.replace(/_/g, " ")}
                required={["titulo", "dependencia"].includes(campo)}
              />
              <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/50 mix-blend-overlay"></div>
            </div>
          </motion.div>
        ))}

        {/* Selector de sede */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-2"
        >
          <label htmlFor="sede_id" className="text-sm font-medium text-gray-700 flex items-center gap-1">
            Sede <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            {loadingSedes ? (
              <div className="bg-gray-50/70 rounded-xl px-4 py-3 animate-pulse backdrop-blur-sm border border-gray-200/80">
                Cargando sedes...
              </div>
            ) : (
              <select
                id="sede_id"
                name="sede_id"
                value={formData.sede_id}
                onChange={handleChange}
                className="w-full bg-gray-50/70 backdrop-blur-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-200/80 shadow-sm appearance-none hover:border-blue-300 transition-all duration-200"
                required
                disabled={loadingSedes}
              >
                <option value="">Seleccionar sede</option>
                {sedes.map((sede) => (
                  <option key={sede.id} value={sede.id}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
            )}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Selector de receptor */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col gap-2"
        >
          <label htmlFor="nombre_receptor" className="text-sm font-medium text-gray-700 flex items-center gap-1">
            Receptor <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            {loadingCoordinadores ? (
              <div className="bg-gray-50/70 rounded-xl px-4 py-3 animate-pulse backdrop-blur-sm border border-gray-200/80">
                Cargando coordinadores...
              </div>
            ) : (
              <select
                id="nombre_receptor"
                name="nombre_receptor"
                value={formData.nombre_receptor}
                onChange={handleChange}
                className="w-full bg-gray-50/70 backdrop-blur-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-200/80 shadow-sm appearance-none hover:border-blue-300 transition-all duration-200"
                required
                disabled={loadingCoordinadores}
              >
                <option value="">Seleccionar receptor</option>
                {coordinadores.map((coordinador) => (
                  <option key={coordinador.id} value={coordinador.id}>
                    {coordinador.nombre_completo}
                  </option>
                ))}
              </select>
            )}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Campo de imagen con drag and drop */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-2 sm:col-span-2"
        >
          <label htmlFor="imagen" className="text-sm font-medium text-gray-700 flex items-center gap-1">
            Imagen <span className="text-red-500">*</span>
          </label>
          <div
            className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 ${formData.imagen ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 hover:border-blue-300 bg-gray-50/30'} backdrop-blur-sm`}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('border-blue-400', 'bg-blue-50/50');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              if (!formData.imagen) {
                e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50/50');
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files.length > 0) {
                handleImageChange({ target: { files: e.dataTransfer.files } });
              }
            }}
          >
            <input
              type="file"
              id="imagen"
              name="imagen"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            {!formData.imagen ? (
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">Haz clic para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-gray-400">Formatos: PNG, JPG, JPEG (Máx. 5MB)</p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={formData.imagen}
                  alt="Vista previa"
                  className="mx-auto h-32 object-contain rounded-lg border border-gray-200/80 shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all duration-200 shadow-md hover:scale-110"
                  title="Eliminar imagen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Campo de descripción */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col gap-2 sm:col-span-2"
        >
          <label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
            Descripción
          </label>
          <div className="relative">
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={4}
              className="w-full bg-gray-50/70 backdrop-blur-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-200/80 shadow-sm transition-all duration-200 hover:border-blue-300"
              placeholder="Ingrese una descripción detallada del mantenimiento..."
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {formData.descripcion ? formData.descripcion.length : 0}/500
            </div>
          </div>
        </motion.div>
      </div>

      {/* Botones con micro-interacciones */}
      <div className="flex justify-between items-center pt-4">
        <BackPage isEdit={mantenimientoEdit} />
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className={`relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {loading && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-70"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {mantenimientoEdit ? "Actualizar" : "Registrar"}
              </>
            )}
          </span>
        </motion.button>
      </div>
    </form>
  );
}