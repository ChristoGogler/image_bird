(function () {
    const vue = new Vue({
        el: "#main",
        data: {
            title: "The Image Board",
            images: [],
        },
        methods: {},

        created: () => console.log("vue created!"),

        mounted: function () {
            console.log("vue mounted!");
            axios.get("/api/images.json").then((images) => {
                console.log("(mounted) :", images.data);
                this.images = images.data;
            });
        },
    });
})();
