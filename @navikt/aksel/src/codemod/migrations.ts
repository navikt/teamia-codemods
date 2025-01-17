import chalk from "chalk";

export const migrations: {
  [key: string]: { description: string; value: string; path: string }[];
} = {
  "nav-frontend": [
    {
      description:
        "Runs all codemods for nav-frontend -> ds-react migration, _WILL_ break stuff",
      value: "nav-frontend-preset",
      path: "nav-frontend/preset/preset",
    },
    {
      description:
        "nav-frontend-alertstriper to @navikt/ds-react migration, will probably break stuff",
      value: "nav-frontend-alertstriper",
      path: "nav-frontend/alertStripe/alertStripe",
    },
    {
      description:
        "nav-frontend-knapper to @navikt/ds-react migration, will probably break stuff",
      value: "nav-frontend-knapper",
      path: "nav-frontend/knapper/knapper",
    },
    {
      description:
        "nav-frontend-lenker to @navikt/ds-react migration, will probably break stuff",
      value: "nav-frontend-lenker",
      path: "nav-frontend/lenker/lenker",
    },
    {
      description:
        "nav-frontend-lenkepanel to @navikt/ds-react migration, will probably break stuff",
      value: "nav-frontend-lenkepanel",
      path: "nav-frontend/lenkepanel/lenkepanel",
    },
    {
      description:
        "nav-frontend-paneler to @navikt/ds-react migration, will probably break stuff",
      value: "nav-frontend-paneler",
      path: "nav-frontend/paneler/paneler",
    },
    {
      description:
        "nav-frontend-popover to @navikt/ds-react migration, will probably break stuff",
      value: "nav-frontend-popover",
      path: "nav-frontend/popover/popover",
    },
    {
      description:
        "nav-frontend-skjema to @navikt/ds-react migration, will probably break stuff",
      value: "nav-frontend-skjema",
      path: "nav-frontend/skjema/skjema",
    },
    {
      description:
        "nav-frontend-spinner to @navikt/ds-react migration, will probably break stuff",
      value: "nav-frontend-spinner",
      path: "nav-frontend/spinner/spinner",
    },
    {
      description:
        "nav-frontend-toggle to @navikt/ds-react migration, will probably break stuff",
      value: "nav-frontend-toggle",
      path: "nav-frontend/toggle/toggle",
    },
    {
      description:
        "nav-frontend-typografi to @navikt/ds-react migration, will probably break stuff",
      value: "nav-frontend-typografi",
      path: "nav-frontend/typografi/typografi",
    },
  ],
  "1.0.0": [
    {
      description: "Runs all codemods for beta -> v1 migration",
      value: "v1-preset",
      path: "v1.0.0/preset/preset",
    },
    {
      description: "Fixes breaking API-changes for <Pagination /> component",
      value: "v1-pagination",
      path: "v1.0.0/pagination/pagination",
    },
    {
      description: "Fixes breaking API-changes for <Tabs /> component",
      value: "v1-tabs",
      path: "v1.0.0/tabs/tabs",
    },
    {
      description:
        "Fixes breaking API-changes for <SpeechBubble /> (now <Chat/>) component",
      value: "v1-chat",
      path: "v1.0.0/chat/chat",
    },
  ],
  "2.0.0": [
    {
      description: "Patches changed css-variables",
      value: "v2-css",
      path: "v2.0.0/update-css-tokens/update-css-tokens",
    },
    {
      description: "Patches changed js-variables",
      value: "v2-js",
      path: "v2.0.0/update-js-tokens/update-js-tokens",
    },
    {
      description: "Patches changed sass-variables",
      value: "v2-sass",
      path: "v2.0.0/update-sass-tokens/update-sass-tokens",
    },
    {
      description: "Patches changed less-variables",
      value: "v2-less",
      path: "v2.0.0/update-less-tokens/update-less-tokens",
    },
  ],
};

export function getMigrationPath(str: string) {
  return Object.values(migrations)
    .reduce((acc, val) => [...val, ...acc], [])
    .find((x) => x.value === str)?.path;
}

export function getMigrationNames() {
  return Object.values(migrations).reduce(
    (acc, val) => [...val.map((x) => x.value), ...acc],
    [] as string[]
  );
}

export function getMigrationString() {
  let str = "";

  Object.entries(migrations).forEach(([version, migrations]) => {
    str += `\n${chalk.underline(version)}\n`;
    migrations.forEach((migration) => {
      str += `${chalk.blue(migration.value)}: ${migration.description}\n`;
    });
  });

  return str;
}
