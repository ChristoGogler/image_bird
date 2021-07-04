(function () {
    const form = document.querySelector("#uploadForm");
    console.log("(script.js) form: ", form);

    //main vue instance
    const mainVueInstance = new Vue({
        el: "#main",
        data: {
            heading: "The Image Brrrd",
            images: [],
            title: "",
            description: "",
            username: "",
            picture: null,
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
                console.log("...(main vue imageclick) id: ", id);
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
        // template:
        //     '<div class="photoframe"><img v-bind:src="url" v-bind:alt="title" /><p>{{title}}</p></div>',
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
                console.log("...(component vue emitClick) id: ", id);
                this.$emit("image-clicked", id);
            },
        },
    });

    // //vue component for lightbox
    // Vue.component("light-box", {
    //     props: ["id", "url", "title", "description", "username"],
    //     template: "#lightBox",
    //     // template:
    //     //     '<div class="photoframe"><img v-bind:src="url" v-bind:alt="title" /><p>{{title}}</p></div>',
    //     methods: {
    //         onClick: function () {
    //             console.log("[single-picture:onClick]", this.id);
    //             this.$emit("single-pic-click", this.id);
    //         },
    //     },
    // });
})();
