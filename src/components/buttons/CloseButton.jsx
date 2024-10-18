export default function CloseButton({ onClick }) {
    return (
        <button className='absolute right-2 top-1/2 -translate-y-1/2 bg-red-300 rounded-full p-1'
            onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>

        </button>
    );
}