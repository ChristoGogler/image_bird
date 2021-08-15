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
            // console.log("submitComment!", this.image_id);
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
        // console.log("comments mounted!", this.image_id);
        axios.get(`/api/images/${this.image_id}/comments`).then((response) => {
            this.comments = response.data;
            // console.log("comments:", response.data);
        });
    },
});
