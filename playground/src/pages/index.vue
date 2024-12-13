<template>
  <div class="markdown-body" style="padding: 2em 3em">
    <icon-logos-vue style="font-size: 2em" />
    <br>
    <h2>Icons</h2>
    <p>
      <icon-fa-solid-dice-five />
      <icon-heroicons-outline-menu-alt-2 />
      <icon-ri-apps-2-line />
      <icon-noto-v1-flag-for-flag-japan />
      <icon-ic-twotone-24mp />
      <icon-twemoji-1st-place-medal />
      <IconIcTwotone23mp />
      <MdiStore24Hour />
      <ExternalCustom3 />
      <br>
    </p>
    <h2>Customizer via Config</h2>
    <p>
      <icon-carbon-app-connectivity />
      <icon-custom-car-a />
      <IconWinDog></IconWinDog>
      <IconAccountBox></IconAccountBox>
    </p>
    <h2>Custom Props via Query</h2>
    <p>
      <MdiAlarmOff />
      <MdiAlarmOff2 />
    </p>
    <h2>Custom Icons</h2>
    <p>
      <icon-custom-steering-wheel style="color: rgb(32, 115, 129)" />
      <icon-inline-foo />
      <icon-inline-async />
      <icon-custom-car-a />
    </p>
    <h2>Collection alias</h2>
    <p>
      <icon-icon-park-abnormal />
    </p>
    <h2>
      Raw Icons from
      <strong>raw</strong> query param
    </h2>
  </div>
</template>

<script setup lang="ts">
import IconAccountBox from '~icons/mdi/account-box';
import RawMdiAlarmOff2 from '~icons/mdi/alarm-off?raw&width=1em&height=1em';
import RawMdiAlarmOff from '~icons/mdi/alarm-off?raw&width=4.25rem&height=4.25rem';
import RawMdiAlarmOff3 from '~icons/mdi/alarm-off?raw&width=unset&height=unset';
import MdiAlarmOff2 from '~icons/mdi/alarm-off?width=1em&height=1em';
import MdiAlarmOff from '~icons/mdi/alarm-off?width=4.25rem&height=4.25rem';
import MdiStore24Hour from '~icons/mdi/store-24-hour';
import Custom1 from '~icons/plain-color-icons/about?raw';
import ExternalCustom3 from '~icons/test-color-icons/about';
import Custom2 from '~icons/test-color-icons/about?raw';
import VSCodePython from '~icons/vscode-icons/file-type-python';
import IconWinDog from '~icons/win/dog';
</script>
