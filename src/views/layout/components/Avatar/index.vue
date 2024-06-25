<template>
    <div class="nav-account">
        <!-- 头像 -->
        <div class="user-avatar"><img :src="avatarUrl" /></div>
        <!-- 用户名 -->
        <div class="user-info">
            <p class="user-item">{{ role }}</p>
            <p class="user-item">{{ userName }}</p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        avatarUrl: {
            type: String,
            default: "",
        },
        role: {
            type: String,
            default: "",
        },
        userName: {
            type: String,
            default: "",
        },
    }

}
</script>
<style lang="scss" scoped>
.nav-account {
    display: flex;
    align-items: center;
    height: 32px;
    margin-inline: 30px 18px;

    .user-avatar {
        width: 32px;
        height: 32px;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;
        }

    }

    .user-info {
        padding-inline: 8px;

        .user-item {
            margin: 0;
            padding: 2px 0
        }

        .user-item:first-child{
            font-weight: bold;
        }
    }
}
</style>
