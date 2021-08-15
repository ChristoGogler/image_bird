(function () {
    //CONSTANTS
    const IMAGES_TO_SHOW = 12;
    const SCROLLING_OFFSET = 200;

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
            last_id: null,
            morePix: true,
        },

        methods: {
            hasScrolledCloseToBottom: function () {
                var pageHeight = $(document).height();
                var windowHeight = $(window).height();
                var scrollTop = $(document).scrollTop();
                if (pageHeight - windowHeight - scrollTop < SCROLLING_OFFSET) {
                    return true;
                }
                return false;
            },

            loadInfiniteScrollResults: function () {
                if (this.morePix == false) {
                    return;
                }
                if (this.hasScrolledCloseToBottom()) {
                    // get more results
                    $("#moreButton").trigger("click");
                    setTimeout(this.loadInfiniteScrollResults, 1000);
                } else {
                    setTimeout(this.loadInfiniteScrollResults, 1000);
                }
            },

            uploadFile: function (event) {
                event.preventDefault();
                const formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("picture", this.picture);
                axios
                    .post("/api/upload", formData)
                    .then((latestImage) => {
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
                this.picture = event.target.files[0];
            },

            openSinglePic: function () {
                this.currentImageId = location.hash.slice(1);
            },

            closeSinglePic: function () {
                this.currentImageId = null;
                location.hash = "";
            },

            changeHeading: function () {},

            moreButtonClick: function () {
                const params = {
                    last_id: this.lastImageID,
                    limit: IMAGES_TO_SHOW,
                };
                axios.get("/api/images.json", { params }).then((images) => {
                    if (images.data.length == 0) {
                        //no more pictures to present!
                        this.morePix = false;
                    }
                    this.images = [...this.images, ...images.data];
                    this.lastImageID = images.data[images.data.length - 1].id;
                });
            },
        },

        mounted: function () {
            const params = {
                last_id: this.lastImageID,
                limit: IMAGES_TO_SHOW,
            };
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

            setTimeout(this.loadInfiniteScrollResults, 3000);
        },
    });
})();
