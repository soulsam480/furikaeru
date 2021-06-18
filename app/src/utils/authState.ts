import axios from 'axios';
import { UserResponse, useUser } from 'src/store/user';
import { useRouter } from 'vue-router';

export async function authState() {
  const __token = localStorage.getItem('__token');

  if (!!__token) {
    const { setLogin, getUser } = useUser();
    const { push } = useRouter();
    try {
      const {
        data: { accessToken },
      } = await axios({
        baseURL: import.meta.env.VITE_API,
        url: '/auth/token',
        headers: {
          'refresh-token': `Bearer ${__token}`,
        },
      });

      if (accessToken) {
        const { data }: { data: UserResponse } = await axios({
          baseURL: import.meta.env.VITE_API,
          url: '/auth/user',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!data) return setLogin(null), localStorage.removeItem('__token');
        setLogin(data);
        push('/user');
      }
    } catch (error) {
      console.log(error);

      setLogin(null);
      localStorage.removeItem('__token');
      push('/');
    }

    setInterval(async () => {
      try {
        const {
          data: { accessToken, refreshToken },
        } = await axios({
          baseURL: import.meta.env.VITE_API,
          url: '/auth/token',
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
}
