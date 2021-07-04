(function () {
    const form = document.querySelector("#uploadForm");
    console.log("(script.js) form: ", form);

    //main vue instance
    const mainVueInstance = new Vue({
        el: "#main",
        data: {
            heading: "The Image B🦅rd",
            images: [],
            title: "",
            description: "",
            username: "",
            picture: null,
            currentImageId: null,
            lightboxVisible: false,
        },
        methods: {
            uploadFile: function (event) {
                event.preventDefault();
                console.log(
                    "(Upload Form): Button clicked!",
                    this.title,
                    this.description,
                    this.username,
                    this.url
                );
                const formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("picture", this.picture);
                console.log("(Upload Form) formData: ", formData);
                axios.post("/api/upload", formData).then((latestImage) => {
                    console.log("(latestImage): ", latestImage.data[0]);
                    this.images.unshift(latestImage.data[0]);
                });
            },
            insertFile: function (event) {
                console.log(
                    "...(file input) chosen file: ",
                    event.target.files[0]
                );
                this.picture = event.target.files[0];
            },
            openSinglePic: function (id) {
                // console.log("...(main vue imageclick) id: ", id);
                console.log(
                    "...(main vue openSinglePic) currentImageId: ",
                    this.currentImageId
                );
                this.currentImageId = id;
                this.lightboxVisible = true;
                console.log(
                    "...(main vue imageclick) currentImageId: ",
                    this.currentImageId
                );
            },
            closeSinglePic: function () {
                console.log("...(main vue closeSinglePic)");
                this.currentImageId = null;
                this.lightboxVisible = false;
            },
            changeHeading: function () {
                console.log("...(changeHeading)");
            },
        },

        created: () => console.log("vue created!"),

        mounted: function () {
            console.log("vue mounted!");
            axios.get("/api/images.json").then((images) => {
                console.log("(mounted) :", images.data);
                this.images = images.data;
            });
        },
    });

    //vue component for single pictures
    Vue.component("single-picture", {
        props: ["id", "url", "title", "description", "username"],
        template: "#singlePicture",
        data: {
            function() {
                return {
                    id: this.id,
                    url: this.url,
                    title: this.title,
                    description: this.description,
                    username: this.username,
                };
            },
        },
        methods: {
            emitClick: function (id) {
                console.log(
                    "...(single picture component - emitClick) id: ",
                    id
                );
                this.$emit("image-clicked", id);
            },
        },
    });

    //vue component for lightbox
    Vue.component("light-box", {
        props: ["id", "image"],
        template: "#lightBox",
        data: {
            function() {
                return {
                    image: {},
                };
            },
        },
        methods: {
            show() {
                this.visible = true;
            },
            hide() {
                this.visible = false;
                this.currentImage = null;
            },
            emitClick() {
                console.log("...(lightbox component - emitClick)");
                this.$emit("button-clicked");
            },
        },
        mounted: function () {
            console.log("lightbox mounted!", this.id);
            axios.get("/api/images/" + this.id).then((response) => {
                console.log("response.data", response.data);
                this.image = response.data;
            });
        },
    });
})();
