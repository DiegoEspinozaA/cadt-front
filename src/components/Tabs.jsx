
export default function Tabs({ options, active, handleChangeActive }) {
    return (
        <div className="text-sm font-semibold text-center text-gray-500 border-b border-gray-200 ">
            <ul className="flex  ">
                <li class="me-2">
                    {options.map((option) => (
                        <a key={option.id} onClick={() => handleChangeActive(option.nombre)} className={`${active === option.nombre ? 'text-blue-600 border-b-2 border-blue-600' : ''} inline-block p-4 rounded-t-lg hover:bg-gray-100 select-none cursor-pointer`}>{option.nombre}</a>
                    ))}
                </li>
            </ul>
        </div>);
}
