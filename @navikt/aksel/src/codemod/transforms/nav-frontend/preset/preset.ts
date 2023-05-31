import { default as alertStripeTransformer } from "../alertStripe/alertStripe";
import { default as knapperTransformer } from "../knapper/knapper";
import { default as lenkepanelTransformer } from "../lenkepanel/lenkepanel";
import { default as lenkerTransformer } from "../lenker/lenker";
import { default as panelerTransformer } from "../paneler/paneler";
import { default as skjemaTransformer } from "../skjema/skjema";
import { default as spinnerTransformer } from "../spinner/spinner";
import { default as toggleTransformer } from "../toggle/toggle";
import { default as typografiTransformer } from "../typografi/typografi";

/**
 * @param {import('jscodeshift').FileInfo} file
 * @param {import('jscodeshift').API} api
 */
export default function transformer(file, api, options) {
  file.source = alertStripeTransformer(file, api);
  file.source = knapperTransformer(file, api);
  file.source = lenkepanelTransformer(file, api);
  file.source = lenkerTransformer(file, api);
  file.source = panelerTransformer(file, api);
  file.source = skjemaTransformer(file, api);
  file.source = spinnerTransformer(file, api);
  file.source = toggleTransformer(file, api);
  file.source = typografiTransformer(file, api);

  return file.source;
}
