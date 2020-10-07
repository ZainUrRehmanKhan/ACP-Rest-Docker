export const UsersSchema = {
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: false
    }
}