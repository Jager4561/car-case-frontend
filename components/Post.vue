<script setup lang="ts"></script>

<template>
	<div class="post_container">
		<div class="post_header">
			<div class="title">Instrukcja wymiany wysprzęglika</div>
			<div class="publish_info">
				<div class="created">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
						/>
					</svg>
					<span>45 min temu</span>
				</div>
				<div class="modified">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
						/>
					</svg>
					<span>22 min temu</span>
				</div>
			</div>
		</div>
		<div class="short_description">
			<p>
				Wiem, jako mechanik, że wielu ludzi próbowało wymieniać
				wysprzęglik w golfie IV i mieli z tym duży problem, dlatego
				umieszczam szczegółową instrukcję wymiany tej części samochodu.
			</p>
		</div>
		<div class="spacer"></div>
		<div class="post_footer">
			<div class="post_info">
				<button class="model">
					<NuxtImg class="model_image" src="golf.jpg"></NuxtImg>
					<div class="fuel_mark">Pb95</div>
					<span class="model_name">Volkswagen Golf IV (1.6l)</span>
				</button>
				<button class="author">
                    <NuxtImg class="author_image" src="revenant.png"></NuxtImg>
                    <span class="author_name">Jan Kowalski</span>
                </button>
			</div>
			<div class="post_actions">
				<button class="icon_button">
					<svg
						class="icon"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L13.1956 3.93847C13.6886 3.3633 14.4642 3.11604 15.1992 3.29977L15.2467 3.31166C16.5885 3.64711 17.1929 5.21057 16.4258 6.36135L14 9.99998H18.5604C19.8225 9.99998 20.7691 11.1546 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20L8 20"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span class="value">234</span>
				</button>
				<button class="icon_button">
					<svg
						class="icon"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M8 14V4M8 14L4 14V4.00002L8 4M8 14L13.1956 20.0615C13.6886 20.6367 14.4642 20.884 15.1992 20.7002L15.2467 20.6883C16.5885 20.3529 17.1929 18.7894 16.4258 17.6387L14 14H18.5604C19.8225 14 20.7691 12.8454 20.5216 11.6078L19.3216 5.60779C19.1346 4.67294 18.3138 4.00002 17.3604 4.00002L8 4"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span class="value">43</span>
				</button>
				<button class="icon_button">
					<svg
						class="icon"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
						/>
					</svg>
					<span class="value">21</span>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.post_container {
	@apply w-full h-auto bg-zinc-900 rounded-lg p-4;

	.post_header {
		@apply w-full h-auto flex items-start justify-between space-x-4 mb-4;

		.title {
			@apply font-bold flex-grow text-lg;
		}

		.publish_info {
			@apply w-auto h-auto flex items-center space-x-2;

			.created,
			.modified {
				@apply w-auto h-auto flex items-center space-x-2 text-zinc-400;

				svg {
					@apply w-4 h-4;
				}

				span {
					@apply text-xs font-normal;
				}
			}
		}
	}

	.short_description {
		@apply w-full h-auto text-sm;
	}

	.spacer {
		@apply w-full h-0.5 bg-zinc-600 my-4;
	}

	.post_footer {
		@apply w-full h-auto flex items-start justify-between;

		.post_info {
			@apply w-auto h-auto flex items-center space-x-2;

			.model {
				@apply w-auto h-auto flex items-center space-x-2 rounded-lg duration-150 pr-2;
                @apply hover:bg-zinc-800 hover:text-white;

				.model_image {
					@apply w-8 h-8 rounded-lg flex-shrink-0 object-center object-cover;
				}

				.fuel_mark {
					@apply w-auto h-auto rounded-md text-2xs font-semibold text-white bg-green-700 px-1 py-0.5;
				}

                .model_name {
                    @apply text-xs font-bold;
                }
			}

            .author {
                @apply w-auto h-auto flex items-center space-x-2 rounded-full duration-150 pr-2;
                @apply hover:bg-zinc-800 hover:text-white;

                .author_image {
                    @apply w-8 h-8 rounded-full flex-shrink-0 object-center object-cover;
                }

                .author_name {
                    @apply text-xs font-bold;
                }
            }
		}

		.post_actions {
			@apply w-auto h-auto flex items-center space-x-1;

			.icon_button {
				@apply w-auto h-auto flex items-center space-x-1 p-1.5 rounded-lg text-gray-400 duration-150;
				@apply hover:bg-zinc-800 hover:text-white;

				.icon {
					@apply w-5 h-5;
				}

				.value {
					@apply text-sm font-medium;
				}
			}
		}
	}
}
</style>
