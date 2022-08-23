export const config: Config = {
    brains: {
        jerry: {
            name: "Jerry's Brain 2",
            homeUrl: "/brainish/jerry/32f9fc36-6963-9ee0-9b44-a89112919e29",
            showVisualizations: true,
            pages: [
                { name: "About", url: "/jerry/about" }
            ]
        },
        climate_search: {
            name: "Your Climate Change Search Engine",
            homeUrl: "/brainish/climate_search/ef41588f-98f3-5080-afe7-a3d2ba8ee98c",
            showVisualizations: false,
            pages: [{ name: "Home", url: "/brainish/climate_search/ef41588f-98f3-5080-afe7-a3d2ba8ee98c" }]
        }
    }
}

export interface Config {
    brains: {
        [key: string]: {
            name: string
            homeUrl: string
            showVisualizations: boolean
            pages: { name: string, url: string }[]
        }
    }
}