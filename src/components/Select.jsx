export default function Select({options, active, change}) {
    return (
        <form class="relative max-w-sm">
            <select id="countries" className="border border-gray-200 px-4 py-2 rounded-xl w-[200px] aparence-none focus:ring-0"
            label="Categoria"
            onChange={change}
            value={active}
            >
                {options.map((option) => (
                    <option key = {option.id} value={option.nombre}>{option.nombre}</option>
                ))}
            </select>
        </form>

    );
}
