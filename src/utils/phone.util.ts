import { CountryCode, formatIncompletePhoneNumber, isValidPhoneNumber, parsePhoneNumberWithError } from "libphonenumber-js";

export const parsePhoneNumber = (phoneNumber: string, countryCode: CountryCode = "BT") => {
  return parsePhoneNumberWithError(phoneNumber, { defaultCountry: countryCode });
};

export const formatPhoneNumber = (phoneNumber: string, countryCode: CountryCode = "BT") => {
  return formatIncompletePhoneNumber(phoneNumber, { defaultCountry: countryCode });
};

export const validatePhoneNumber = (phoneNumber: string, countryCode: CountryCode = "BT") => {
  const isValid = isValidPhoneNumber(phoneNumber, { defaultCountry: countryCode });
  if (!isValid) return 'Invalid phone number';
  return undefined;
};