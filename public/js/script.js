(function () {
    const IMAGES_TO_SHOW = 12;

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
            currentImageId: location.hash.slice(1),
            // lightboxVisible: false,
            last_id: null,
            morePix: true,
        },

        methods: {
            uploadFile: function (event) {
                event.preventDefault();
                console.log("(UploadFile): Button clicked!");
                const formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("picture", this.picture);
                // console.log("(Upload Form) formData: ", formData);
                axios
                    .post("/api/upload", formData)
                    .then((latestImage) => {
                        // console.log("(latestImage): ", latestImage.data[0]);
                        this.images.unshift(latestImage.data[0]);
                        this.title = "";
                        this.description = "";
                        this.username = "";
                        this.picture = null;
                    })
                    .catch((error) => {
                        console.log("Error getting images from db.", error);
                    });
            },
            insertFile: function (event) {
                console.log(
                    "...(insertFile) chosen file: ",
                    event.target.files[0]
                );
                this.picture = event.target.files[0];
            },
            openSinglePic: function () {
                console.log(
                    "...(main vue openSinglePic) id: ",
                    location.hash.slice(1)
                );
                this.currentImageId = location.hash.slice(1);
            },
            closeSinglePic: function () {
                console.log("...(main vue closeSinglePic)");
                this.currentImageId = null;
                location.hash = "";
                // this.lightboxVisible = false;
            },
            changeHeading: function () {
                // console.log("...(changeHeading)");
            },
            moreButtonClick: function () {
                console.log("moreButtonClick");
                const params = {
                    last_id: this.lastImageID,
                    limit: IMAGES_TO_SHOW,
                };
                // console.log("PARAMS: ", params);

                axios.get("/api/images.json", { params }).then((images) => {
                    this.images = [...this.images, ...images.data];
                    this.lastImageID = images.data[images.data.length - 1].id;
                });
            },
        },

        mounted: function () {
            console.log("vue mounted!");
            const params = {
                last_id: this.lastImageID,
                limit: IMAGES_TO_SHOW,
            };
            // console.log("PARAMS: ", params);
            axios
                .get("/api/images.json", { params })
                .then((images) => {
                    this.images = images.data;
                    this.lastImageID = images.data[images.data.length - 1].id;
                })
                .catch((error) => {
                    console.log("Error getting images from db. ", error);
                    this.morePix = false;
                });
            window.addEventListener("hashchange", this.openSinglePic);
        },
    });

    //vue component for single pictures
    Vue.component("single-picture", {
        props: [
            "id",
            "url",
            "title",
            "description",
            "username",
            "currentImageId",
        ],
        template: "#singlePicture",
        methods: {
            emitClick: function () {
                console.log(
                    "...(single picture component - emitClick) id: ",
                    this.currentImageId
                );
                this.$emit("image-clicked", this.currentImageId);
            },
        },
        mounted: function () {
            // console.log("single pix mounted!", this.id);
        },
    });

    //vue component for lightbox
    Vue.component("light-box", {
        props: ["id"],
        template: "#lightBox",
        data: function () {
            return {
                image: {},
            };
        },
        watch: {
            id: function () {
                this.mountLightbox();
            },
        },
        methods: {
            mountLightbox() {
                console.log("lightbox mounted!", this.id);
                axios.get("/api/images/" + this.id).then((response) => {
                    console.log("Response data: ", response.data);
                    if (!response.data) {
                        console.log("not an image id!");
                        this.image = {};
                        this.emitClick();
                        return;
                    }
                    this.image = response.data;
                });
            },

            emitClick() {
                console.log("...(lightbox component - emitClick)");
                this.$emit("button-clicked");
            },
        },
        mounted: function () {
            this.mountLightbox();
        },
    });

    //vue component for comments
    Vue.component("comments", {
        props: ["image_id"],
        template: "#comments",
        data: function () {
            return {
                comments: [],
                latestComment: "",
                comment: "",
                username: "",
                created_at: "",
            };
        },
        methods: {
            submitComment: function () {
                console.log("submitComment!", this.image_id);
                axios
                    .post(`/api/images/${this.image_id}/comments`, {
                        imageId: this.image_id,
                        username: this.username,
                        comment: this.comment,
                    })
                    .then((response) => {
                        this.latestComment = response.data;
                        this.comments.push(this.latestComment);
                        // console.log("latestComment:", this.latestComment);
                        this.comment = "";
                    })
                    .catch((error) => {
                        console.log("Error getting comments from db", error);
                    });
            },
        },
        mounted: function () {
            console.log("comments mounted!", this.image_id);
            axios
                .get(`/api/images/${this.image_id}/comments`)
                .then((response) => {
                    this.comments = response.data;
                    console.log("comments:", response.data);
                });
        },
    });
})();
