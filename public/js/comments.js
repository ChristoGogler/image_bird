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
            axios
                .post(`/api/images/${this.image_id}/savecomment`, {
                    imageId: this.image_id,
                    username: this.username,
                    comment: this.comment,
                })
                .then((response) => {
                    this.latestComment = response.data;
                    this.comments.push(this.latestComment);
                    this.comment = "";
                })
                .catch((error) => {
                    console.log("Error getting comments from db", error);
                });
        },
    },
    mounted: function () {
        axios.get(`/api/images/${this.image_id}/comments`).then((response) => {
            this.comments = response.data;
        });
    },
});
