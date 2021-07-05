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
            currentImageId: null,
            lightboxVisible: false,
            last_id: null,
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
                        console.log("(latestImage): ", latestImage.data[0]);
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
            openSinglePic: function (id) {
                this.currentImageId = id;
                this.lightboxVisible = true;
                console.log(
                    "...(main vue openSinglePic) currentImageId: ",
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
            moreButtonClick: function () {
                console.log("moreButtonClick");
                const params = {
                    last_id: this.lastImageID,
                    limit: IMAGES_TO_SHOW,
                };
                console.log("PARAMS: ", params);

                axios.get("/api/images.json", { params }).then((images) => {
                    console.log("(mounted) :", images.data);
                    this.images = [...this.images, ...images.data];
                    this.lastImageID = images.data[images.data.length - 1].id;
                    console.log("lastImageId: ", this.lastImageID);
                });
            },
        },

        created: () => console.log("vue created!"),

        mounted: function () {
            console.log("vue mounted!");
            const params = {
                last_id: this.lastImageID,
                limit: IMAGES_TO_SHOW,
            };
            console.log("PARAMS: ", params);
            axios.get("/api/images.json", { params }).then((images) => {
                console.log(
                    "(mounted) :",
                    images.data,
                    images.data[images.data.length - 1].id
                );
                this.images = images.data;
                this.lastImageID = images.data[images.data.length - 1].id;
                console.log("lastImageId: ", this.lastImageID);
            });
        },
    });

    //vue component for single pictures
    Vue.component("single-picture", {
        props: ["id", "url", "title", "description", "username"],
        template: "#singlePicture",
        methods: {
            emitClick: function (id) {
                console.log(
                    "...(single picture component - emitClick) id: ",
                    id
                );
                this.$emit("image-clicked", id);
            },
        },
        mounted: function () {
            console.log("single pix mounted!", this.id);
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
                // console.log("response.data", response.data);
                this.image = response.data;
            });
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
function getMoreImages(params) {
    axios.get("/api/images.json", { params }).then((images) => {
        console.log("(mounted) :", images.data);
        this.images = images.data;
    });
}
