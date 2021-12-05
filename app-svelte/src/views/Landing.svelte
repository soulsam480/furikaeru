<script lang="ts">
  import SvIcon from 'src/components/lib/SVIcon.svelte';
  import { useUserStore } from 'src/store/user';
  import { setToken } from 'src/utils/api';
  import { getUserData, setUUID, tokenWatcher } from 'src/utils/authState';
  import { onMount } from 'svelte';
  import { useLocation, useNavigate } from 'svelte-navigator';

  const navigate = useNavigate();
  const location = useLocation();
  const { setLogin } = useUserStore();

  const url = import.meta.env.VITE_API;

  function login(type: 'google' | 'fb') {
    switch (type) {
      case 'google':
        window.location.href = `${url}/auth/google/`;
        break;

      case 'fb':
        window.location.href = `${url}/auth/fb/`;
        break;

      default:
        break;
    }
  }

  function getSuccessToken() {
    const locationStr = $location.hash || $location.search;

    return locationStr.split('auth_success=')[1] || '';
  }

  async function catchRedirect() {
    const auth_success = getSuccessToken();

    if (!auth_success.length) return;

    setToken(auth_success);

    try {
      const data = await getUserData();

      localStorage.setItem('__token', data.refreshToken);
      setToken(data.accessToken);

      setLogin(data);
      setUUID();

      tokenWatcher(navigate);

      navigate('/home');
      // hideLoader();
    } catch (error) {
      console.log(error);
      // hideLoader();
    }
  }

  onMount(async () => await catchRedirect());
</script>

<div class="hero h-[calc(100vh-48px)]">
  <div class="flex-col justify-center hero-content lg:flex-row">
    <div class="text-center lg:text-left">
      <img src="/icon-144.png" class="block m-auto pb-3" alt="icon-72.png" />
      <div class="text-5xl font-bold text-center mb-2">Furikaeru</div>

      <p class="mb-5 text-lg text-justify">
        A small app to discuss retrospective while being Anonymous. Create public/private boards with a simple kanban
        board interface and realtime changes. Flexible, simple and free.
      </p>
    </div>
    <div class="card flex-shrink-0 w-full max-w-lg border border-primary ">
      <div class="card-body px-3 py-10">
        <div class="alert alert-info py-2">
          <div class="flex-1 space-x-2">
            <SvIcon icon="ion:information-circle" size="25px" />
            <div class="text-sm">
              You are currently in anonymous mode. You can still view/edit public boards. Login/signup to create a
              board.
            </div>
          </div>
        </div>

        <div class="text-center text-lg mt-5">Login with</div>

        <div class="flex justify-center space-x-2 mt-2  ">
          <button class="btn btn-secondary btn-md btn-square" on:click={() => login('google')}>
            <SvIcon icon="ion:logo-google" size="25px" />
          </button>

          <button class="btn btn-secondary btn-md btn-square" on:click={() => login('google')}>
            <SvIcon icon="ion:logo-facebook" size="25px" />
          </button>
        </div>

        <div class="text-sm text-center mt-6">To prevent spamming, only passwordless login is available.</div>
      </div>
    </div>
  </div>
</div>
