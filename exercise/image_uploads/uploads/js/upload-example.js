(function () {
    console.log("upload-example.js");

    // organise your selectors however you like
    // keep it simple for this example!
    const form = document.querySelector("form");
    const imgDescript = form.querySelector("#description");
    const file = form.querySelector("#picture");

    form.addEventListener("submit", (event) => {
        console.log(" fileinput", file.files[0]);
        console.log(" descriptioninput", imgDescript.value);
        // important, or the page will reload!
        event.preventDefault();

        const formData = new FormData();
        console.log("BEFORE Formdata: ", formData);

        formData.append("description", imgDescript.value);
        formData.append("picture", file.files[0]);
        console.log("AFTER Formdata: ", formData);
        axios
            .post("/api/upload", formData)
            .then((response) => {
                console.log("[axios:post RESPONSE]", response.data);
                alert(`Image saved as: ${response.data.filename}`);
            })
            .catch((error) => console.log("ERROR: ", error));
    });
})();
