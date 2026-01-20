/**
 * Function to fetch a URL using native fetch API (Node 24+)
 *
 * @param input_url
 * @param auth_token
 * @param redirect_count
 */
export async function fetch(
  input_url: string,
  auth_token?: string,
  redirect_count = 5
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'User-Agent': `Mozilla/5.0 (${process.platform} ${process.arch}) setup-php`
  };
  if (auth_token) {
    headers['Authorization'] = 'Bearer ' + auth_token;
  }

  try {
    const response = await globalThis.fetch(input_url, {
      headers,
      redirect: redirect_count > 0 ? 'follow' : 'manual'
    });

    if (response.ok) {
      const data = await response.text();
      return {data};
    } else if (
      [301, 302, 303, 307, 308].includes(response.status) &&
      redirect_count <= 0
    ) {
      return {error: `${response.status}: Redirect error`};
    } else {
      return {error: `${response.status}: ${response.statusText}`};
    }
  } catch (error) {
    return {error: `Fetch error: ${(error as Error).message}`};
  }
}
