import axios from 'axios';
import { UserResponse, useUser } from 'src/store/user';
import { v4 } from 'uuid';
import { useRouter } from 'vue-router';

type Tokens = { accessToken: string; refreshToken: string };

export async function authState() {
  const { setLogin, getUser, isLoggedIn, showLoader, hideLoader } = useUser();
  const __token = localStorage.getItem('__token');

  if (!!__token) {
    showLoader();
    const { push, currentRoute } = useRouter();
    try {
      const {
        data: { accessToken },
      } = await axios.get<Tokens>('/auth/token', {
        baseURL: import.meta.env.VITE_API,
        headers: {
          'refresh-token': `Bearer ${__token}`,
        },
      });

      if (accessToken) {
        const { data } = await axios.get<UserResponse>('/auth/user', {
          baseURL: import.meta.env.VITE_API,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!data) return setLogin(null), localStorage.removeItem('__token');
        setLogin(data);

        if (currentRoute.value.name !== 'PublicBoard') await push('/user');
        hideLoader();
      }
    } catch (error) {
      console.log(error);

      setLogin(null);
      localStorage.removeItem('__token');
      await push('/');
      hideLoader();
    }

    setInterval(async () => {
      try {
        const {
          data: { accessToken, refreshToken },
        } = await axios.get<UserResponse>('/auth/token', {
          baseURL: import.meta.env.VITE_API,
          headers: {
            'refresh-token': `Bearer ${__token}`,
          },
        });
        localStorage.setItem('__token', refreshToken);
        setLogin({ ...getUser.value, accessToken, refreshToken });
      } catch (error) {
        console.log(error);

        setLogin(null);
        localStorage.removeItem('__token');
        push('/');
      }
    }, 846000);
  }

  if (!isLoggedIn.value) {
    const uuid = localStorage.getItem('__uuid');
    if (!uuid) {
      localStorage.setItem('__uuid', v4());
    }
  }
}
