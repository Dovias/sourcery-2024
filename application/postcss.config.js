import tailwind from 'tailwindcss';
import fontmagician from 'postcss-font-magician';
import cssnano from 'cssnano';
import cssnanoPresetAdvanced from 'cssnano-preset-advanced'

const configuration = {
    plugins: [
        tailwind,
        fontmagician,
        cssnano(cssnanoPresetAdvanced())
    ]
}

export default configuration;
