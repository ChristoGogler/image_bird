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
            // console.log("lightbox mounted!", this.id);
            axios.get("/api/images/" + this.id).then((response) => {
                // console.log("Response data: ", response.data);
                if (!response.data) {
                    // console.log("not an image id!");
                    this.image = {};
                    this.emitClick();
                    return;
                }
                this.image = response.data;
            });
        },

        emitClick() {
            // console.log("...(lightbox component - emitClick)");
            this.$emit("button-clicked");
        },
    },
    mounted: function () {
        this.mountLightbox();
        //add listener for backdrop click closing of the lightbox
        document
            .querySelector(".backdrop")
            .addEventListener("click", this.emitClick);
    },
});
