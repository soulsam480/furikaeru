<script lang="ts">
  import SvIcon from 'src/components/lib/SVIcon.svelte';
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
          <button class="btn btn-secondary btn-md btn-square">
            <SvIcon icon="ion:logo-google" size="25px" />
          </button>

          <button class="btn btn-secondary btn-md btn-square">
            <SvIcon icon="ion:logo-facebook" size="25px" />
          </button>
        </div>

        <div class="text-sm text-center mt-6">To prevent spamming, only passwordless login is available.</div>
      </div>
    </div>
  </div>
</div>
