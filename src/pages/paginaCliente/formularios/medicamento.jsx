import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { useApp } from "../../../store/AppContext";
import {
	crearMedicamento,
	actualizarMedicamento,
} from "../../../services/medicamento";
import BackPage from "../components/BackPage";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function FormularioMedicamentos() {
	const { usuario } = useApp();
	const location = useLocation();
	const medicamentoEdit = location.state?.medicamento;

	useEffect(() => {
		if (medicamentoEdit) {
			setFormData(medicamentoEdit);
		}
	}, [medicamentoEdit]);

	const [formData, setFormData] = useState({
		principio_activo: "",
		forma_farmaceutica: "",
		concentracion: "",
		lote: "",
		fecha_vencimiento: "",
		presentacion_comercial: "",
		unidad_medida: "",
		registro_sanitario: "",
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
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
			if (medicamentoEdit?.id) {
				await actualizarMedicamento(medicamentoEdit.id, datosConUsuario);
				Swal.fire({
					icon: "success",
					title: "¡Actualizado!",
					text: "Medicamento actualizado correctamente",
					timer: 2000,
					showConfirmButton: false,
				});
			} else {
				await crearMedicamento(datosConUsuario);
				Swal.fire({
					icon: "success",
					title: "¡Éxito!",
					text: "Medicamento registrado correctamente",
					timer: 2000,
					showConfirmButton: false,
				});
				setFormData({
					principio_activo: "",
					forma_farmaceutica: "",
					concentracion: "",
					lote: "",
					fecha_vencimiento: "",
					presentacion_comercial: "",
					unidad_medida: "",
					registro_sanitario: "",
				});
			}
		} catch (err) {
			console.error(err);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: err.message || "No se pudo registrar el medicamento",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-2xl space-y-6"
		>
			<h2 className="text-2xl font-semibold text-center text-gray-800">
				Registrar Medicamento
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{Object.keys(formData).map((campo, i) => (
					<motion.div
						key={campo}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.05 }}
						className="flex flex-col gap-1"
					>
						<label
							htmlFor={campo}
							className="text-sm font-medium text-gray-700 capitalize"
						>
							{campo.replace(/_/g, " ")}
						</label>

						<input
							type={campo === "fecha_vencimiento" ? "date" : "text"}
							id={campo}
							name={campo}
							value={formData[campo]}
							onChange={handleChange}
							className="bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder={campo.replace(/_/g, " ")}
						/>
					</motion.div>
				))}
			</div>

			<div className="flex justify-between">
				<BackPage isEdit={medicamentoEdit} />
				<button
					type="submit"
					disabled={loading}
					className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
				>
					{loading ? (
						<>
							<Loader2 className="animate-spin" size={20} />
							Guardando...
						</>
					) : (
						<>
							<Save size={20} />
							Registrar
						</>
					)}
				</button>
			</div>
		</form>
	);
}
