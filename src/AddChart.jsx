




function AddChart ({HandleClick}) {

    return(
        <div className="absolute top-4 right-4 z-10">
            <button
                onClick={HandleClick}
                id="open-add-modal"
                className="inline-flex items-center gap-2 rounded bg-primary px-3 py-2 text-sm font-medium text-black hover:bg-primary-dark"
                type="button"
            >
                + Add
            </button>
        </div>
    )
}
export default AddChart;