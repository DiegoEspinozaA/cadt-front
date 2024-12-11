import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { User, BriefcaseMedical, FileInput, Hospital } from 'lucide-react'
import { Link } from "react-router-dom"
const categories = [
  {
    categoria: "Funcionarios",
    redirect: "/funcionarios",
    icono: <User className="w-12 h-12 mb-4 text-primary" />,
    roles: ["admin"],
  },
  {
    categoria: "Inventario",
    redirect: "/inventario",
    icono: <BriefcaseMedical className="w-12 h-12 mb-4 text-primary" />,
    roles: ["admin", "encargado"],
  },
  {
    categoria: "Solicitudes",
    redirect: "/solicitudes",
    icono: <FileInput className="w-12 h-12 mb-4 text-primary" />,
    roles: ["admin", "encargado"],
  },
  {
    categoria: "Areas y bodegas",
    redirect: "/areasbodegas",
    icono: <Hospital  className="w-12 h-12 mb-4 text-primary" />,
    roles: ["admin"],
  }
]

const Categoria = ({ categoria, redirect, icono }) => (
  <Link to={redirect}>
    <div className="w-full h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border-2 cursor-pointer">
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        {icono}
        <h2 className="text-xl font-semibold text-gray-800">{categoria}</h2>
      </div>
    </div>
  </Link>
)

const Home = () => {
  const [rol, setRol] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      const decoded = jwtDecode(token)
      setRol(decoded.rol)
    }
  }, [])

  const filteredCategories = categories.filter((cat) =>
    cat.roles.includes(rol)
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          Panel de Control
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat, index) => (
            <Categoria
              key={index}
              categoria={cat.categoria}
              redirect={cat.redirect}
              icono={cat.icono}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home

