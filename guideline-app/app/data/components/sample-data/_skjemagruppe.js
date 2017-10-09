import { SkjemaGruppe, Checkbox } from 'NavFrontendModules/nav-frontend-skjema'; // eslint-disable-line import/no-extraneous-dependencies, import/extensions, import/no-unresolved
import generateSample from './../../../utils/sampling/sampleDataGenerator';

const options = [
    { label: 'Bakerst', value: 'bakerst', id: 'bakerst-checkbox', name: 'bakerst' },
    { label: 'Fremst', value: 'fremst', id: 'fremst-checkbox', name: 'fremst' },
    { label: 'Midten', value: 'midten', id: 'midten-checkbox', name: 'midten' }
];

const checkboxChildren = (
    options.map((checkboxChildProps) => ({
        component: Checkbox,
        attrs: checkboxChildProps
    }))
);

export default generateSample(null, SkjemaGruppe, { title: 'Hvor vil du sitte?' }, checkboxChildren);
