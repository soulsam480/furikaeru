import { mount } from '@vue/test-utils';
import UserCards from '../src/components/UserCards.vue';

test('renders a todo', () => {
  const wrapper = mount(UserCards);

  const base = wrapper.get('[data-test="wrapper"]');
});
