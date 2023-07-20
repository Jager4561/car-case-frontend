<script setup lang="ts"></script>

<template>
    <div class="sidebar_container">
        <nav>
            <h5 class="menu_title">MENU</h5>
            <NuxtLink to="/" class="nav_link" active-class="active">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
                <span>Strona główna</span>
            </NuxtLink>
            <NuxtLink to="/modele" class="nav_link" active-class="active">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                    <path fill-rule="evenodd" d="M2.25 4.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875V17.25a4.5 4.5 0 11-9 0V4.125zm4.5 14.25a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clip-rule="evenodd" />
                    <path d="M10.719 21.75h9.156c1.036 0 1.875-.84 1.875-1.875v-5.25c0-1.036-.84-1.875-1.875-1.875h-.14l-8.742 8.743c-.09.089-.18.175-.274.257zM12.738 17.625l6.474-6.474a1.875 1.875 0 000-2.651L15.5 4.787a1.875 1.875 0 00-2.651 0l-.1.099V17.25c0 .126-.003.251-.01.375z" />
                </svg>
                <span>Lista modeli</span>
            </NuxtLink>
            <NuxtLink to="/moje-dokumentacje" class="nav_link" active-class="active">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                    <path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clip-rule="evenodd" />
                    <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                </svg>
                <span>Moje dokumentacje</span>
            </NuxtLink>
            <NuxtLink to="/moje-opinie" class="nav_link" active-class="active">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                    <path fill-rule="evenodd" d="M14.47 2.47a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06l4.72-4.72H9a5.25 5.25 0 100 10.5h3a.75.75 0 010 1.5H9a6.75 6.75 0 010-13.5h10.19l-4.72-4.72a.75.75 0 010-1.06z" clip-rule="evenodd" />
                </svg>
                <span>Moje opinie</span>
            </NuxtLink>
        </nav>
        <div class="bottom">
            <footer>
                <div class="links">
                    <NuxtLink to="/pomoc" class="link">Pomoc</NuxtLink>
                    <NuxtLink to="/o-aplikacji" class="link">O aplikacji</NuxtLink>
                    <NuxtLink to="/regulamin" class="link">Regulamin</NuxtLink>
                    <NuxtLink to="/polityka-prywatnosci" class="link">Polityka prywatności</NuxtLink>
                </div>
                <div class="copyright">
                    Copyright &copy; 2023 - Wojciech Cyrwus
                </div>
            </footer>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .sidebar_container {
        @apply sticky top-0 left-0 w-full h-full flex flex-col justify-between p-6;
        @apply lg:pl-6 lg:pr-3 lg:py-6;

        nav {
            .menu_title {
                @apply text-xs uppercase font-light text-zinc-400 mb-2;
            }

            .nav_link {
                @apply w-full h-auto flex items-center space-x-2 text-base font-bold rounded-md px-4 py-3 text-white duration-150 mb-2;
                @apply hover:bg-zinc-700;
                @apply lg:text-sm lg:py-2;

                .icon {
                    @apply w-6 h-6;
                    @apply lg:w-5 lg:h-5;
                }
            }

            .active {
                @apply bg-zinc-700 text-darkCyan;
            }
        }

        .bottom {
            footer {
                @apply w-full h-auto rounded-md bg-zinc-900 p-4;

                .links {
                    @apply grid grid-cols-2 gap-x-2 gap-y-4 text-base font-medium mb-6;
                    @apply lg:text-xs;

                    .link {
                        @apply text-zinc-400 duration-150 hover:text-white;
                    }

                }

                .copyright {
                    @apply text-zinc-500 text-sm font-light;
                    @apply lg:text-xs;
                }
            }
        }
    }
</style>