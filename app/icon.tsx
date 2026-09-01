import SiteBrandingIcon from '~/components/SiteBrandingIcon';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const TEXT_COLOR = `#${process.env.SITE_TEXT_COLOR ?? '2f3d4f'}`;
const ACCENT_COLOR = `#${process.env.SITE_ACCENT_COLOR ?? 'e55242'}`;

export default async function Icon() {
  const response = await SiteBrandingIcon({
    ...size,
    fontSize: 60,
    textColor: TEXT_COLOR,
    accentColor: ACCENT_COLOR,
  });

  return response;
}
