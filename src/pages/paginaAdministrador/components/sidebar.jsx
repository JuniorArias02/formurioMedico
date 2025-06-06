import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../store/AppContext";
import { ADMINISTRADOR } from "../../../const/variable_entorno";
import { ChevronDown, ChevronUp, LogOut, Home, Users, List, FileText, PlusSquare, Eye } from "lucide-react";
import useAvatar from "../../../hook/useAvatar";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "../../../hook/useMobile";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
	const navigate = useNavigate();
	const { usuario, logout } = useApp();
	const [menuUsuariosOpen, setMenuUsuariosOpen] = useState(false);
	const [menuFormulariosOpen, setMenuFormulariosOpen] = useState(false);
	const avatarSrc = useAvatar(usuario?.nombre_completo, usuario?.avatar);
	const isMobile = useIsMobile();

	const variants = {
		open: {
			x: 0,
			pointerEvents: "auto",
			transition: { type: "spring", stiffness: 300, damping: 30 },
		},
		closed: {
			x: "-100%",
			pointerEvents: "none",
			transition: { type: "spring", stiffness: 300, damping: 30 },
		},
	};

	const subMenuVariants = {
		hidden: { opacity: 0, height: 0, transition: { duration: 0.3 } },
		visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
	};

	const handleLogout = () => {
		logout();
		setSidebarOpen(false);
		navigate("/");
	};

	return (
		<>
			{isMobile && sidebarOpen && (
				<div
					className="fixed inset-0 bg-[#05050529] bg-opacity-50 z-30"
					onClick={() => setSidebarOpen(false)}
				/>
			)}
			<motion.aside
				className={`
          bg-[#013459] text-white h-screen shadow-md z-40 transition-all duration-100 ease-in-out overflow-hidden
          ${isMobile
						? "fixed top-0 left-0 w-64 p-4"
						: sidebarOpen
							? "relative w-64 p-4"
							: "relative w-0 p-0"
					}
        `}
				initial="closed"
				animate={sidebarOpen ? "open" : "closed"}
				variants={variants}
			>
				{/* Perfil usuario */}
				<div className="flex items-center space-x-3 mb-6 p-2 rounded bg-[#085286] transition cursor-context-menu ">
					<img
						src={avatarSrc}
						alt="Avatar"
						className="w-12 h-12 rounded-full object-cover"
					/>
					<div>
						<p className="font-semibold">{usuario?.nombre_completo || "Usuario"}</p>
						<p className="text-sm text-gray-300">{usuario?.rol}</p>
					</div>
				</div>

				<h2 className="text-lg font-semibold mb-4 text-center">Menú</h2>
				<ul className="space-y-4">
					{usuario?.rol === ADMINISTRADOR && (
						<>
							<li>
								<button
									onClick={() => navigate("/dashboardAdmin")}
									className="w-full text-left px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
								>
									<Home size={18} />
									Inicio
								</button>
							</li>

							<li>
								<button
									onClick={() => setMenuUsuariosOpen(!menuUsuariosOpen)}
									className="w-full flex justify-between items-center text-left px-3 py-2 rounded hover:bg-blue-600 transition cursor-pointer"
								>
									<Users size={18} />
									Usuarios
									{menuUsuariosOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
								</button>

								<AnimatePresence>
									{menuUsuariosOpen && (
										<motion.ul
											className="ml-4 mt-2 space-y-2 text-sm overflow-hidden"
											initial="hidden"
											animate="visible"
											exit="hidden"
											variants={subMenuVariants}
										>
											<li>
												<button
													onClick={() => navigate("/dashboard/view_usuarios")}
													className="w-full text-left px-2 py-1 rounded hover:bg-blue-700 cursor-pointer flex items-center gap-2"
												>
													<Eye size={16} />
													Ver Usuarios
												</button>

											</li>
										</motion.ul>
									)}
								</AnimatePresence>
							</li>

							<li>
								<button
									onClick={() => setMenuFormulariosOpen(!menuFormulariosOpen)}
									className="w-full flex justify-between items-center text-left px-3 py-2 rounded hover:bg-blue-600 transition cursor-pointer"
								>
									<FileText size={18} />
									Formularios
									{menuFormulariosOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
								</button>

								<AnimatePresence>
									{menuFormulariosOpen && (
										<motion.ul
											className="ml-4 mt-2 space-y-2 text-sm overflow-hidden"
											initial="hidden"
											animate="visible"
											exit="hidden"
											variants={subMenuVariants}
										>
											<li>
												<button
													onClick={() => navigate("/dashboard")}
													className="w-full text-left px-2 py-1 rounded hover:bg-blue-700 cursor-pointer flex items-center gap-2"
												>
													<List size={16} />
													<span>Ver Formularios</span>
												</button>

											</li>
											<li>
												<button
												onClick={() => navigate("/dashboardAdmin/crear_formulario")}
												className="w-full text-left px-2 py-1 rounded hover:bg-blue-700 cursor-pointer flex items-center gap-2">
													<PlusSquare size={16} />
													Crear Formulario
												</button>

											</li>
										</motion.ul>
									)}
								</AnimatePresence>
							</li>
						</>
					)}

					<li>
						<button
							onClick={handleLogout}
							className="w-full flex items-center space-x-2 px-3 py-2 rounded hover:bg-red-600 transition text-left cursor-pointer"
							title="Cerrar sesión"
						>
							<LogOut size={18} />
							<span>Cerrar Sesión</span>
						</button>
					</li>
				</ul>
			</motion.aside>
		</>
	);
}
