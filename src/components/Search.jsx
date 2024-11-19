import IconButton from '@mui/material/IconButton';

export default function Search({ text, setText, handleResetSearch }) {
    return (
        <div className="flex items-center bg-[#eaf1fb] rounded-full focus-within:bg-white  focus-within:border-gray-300 focus-within:shadow-md px-4  group w-[600px]"
        >
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </IconButton>
            <input
                className="bg-transparent appearance-none border-none focus:outline-none ml-4 focus:placeholder-gray-400 py-4 w-full"
                placeholder="Buscar"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}

            />
            {text &&
                <IconButton type="button" sx={{ p: '10px' }} aria-label="borrar texto" onClick={handleResetSearch}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </IconButton>}
         
        </div>
    );
}