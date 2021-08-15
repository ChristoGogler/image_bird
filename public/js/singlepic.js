//vue component for single pictures
Vue.component("single-picture", {
    props: ["id", "url", "title", "description", "username", "currentImageId"],
    template: "#singlePicture",
    methods: {
        emitClick: function () {
            // console.log(
            //     "...(single picture component - emitClick) id: ",
            //     this.currentImageId
            // );
            this.$emit("image-clicked", this.currentImageId);
        },
    },
    mounted: function () {
        // console.log("single pix mounted!", this.id);
    },
});
