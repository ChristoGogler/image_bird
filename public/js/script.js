(function () {
    const form = document.querySelector("#uploadForm");
    console.log("(script.js) form: ", form);

    const vInstance = new Vue({
        el: "#main",
        data: {
            heading: "The Image Board",
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

    Vue.component("single-picture", {
        props: ["id", "url", "title", "description", "username"],
        // template: "#onepic",
        template:
            '<div class="photoframe"><img v-bind:src="url" v-bind:alt="title" /><p>{{title}}</p></div>',
        methods: {
            onClick: function () {
                console.log("[single-picture:onClick]", this.id);
                this.$emit("single-pic-click", this.id);
            },
        },
    });
})();
