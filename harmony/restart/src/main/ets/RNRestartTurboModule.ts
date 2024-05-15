/**
 * MIT License
 *
 * Copyright (C) 2024 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { TM } from '@rnoh/react-native-openharmony/generated/ts';
import type Want from '@ohos.app.ability.Want';
import common from '@ohos.app.ability.common';

export class RNRestartTurboModule extends TurboModule implements TM.RestartNativeModule.Spec {
  // 待启动的Ability名称
  private abilityName: string = "EntryAbility";

  // 启动原因
  static restartReason: string = '';

  // UIAbility上下文环境
  private uiAbilityContext: common.UIAbilityContext;

  constructor(ctx: TurboModuleContext) {
    super(ctx);
    this.uiAbilityContext = ctx.uiAbilityContext;
  }

  /*应用名称*/
  private get bundleName(): string {
    return this.uiAbilityContext.abilityInfo.bundleName;
  }

  /*指定的启动目标*/
  private get want(): Want {
    return {
      bundleName: this.bundleName,
      abilityName: this.abilityName
    };
  }

  /*重新启动*/
  public restart(reason: string): void {
    try {
      RNRestartTurboModule.restartReason = reason;
      let applicationContext = this.uiAbilityContext.getApplicationContext();
      applicationContext.restartApp(this.want);
    } catch (exception) {
      const errMsg = { code: 16000064, message: 'Restart too frequently. Try again at least 10s later.' }
      throw new Error(JSON.stringify(errMsg))
    }
  }

  /*设置restart别名*/
  public Restart = this.restart;

  /*异步获取重新启动的原因*/
  public getReason(): Promise<string> {
    return new Promise((resolve, reject) => {
      const reason = RNRestartTurboModule.restartReason;
      if (reason) {
        resolve(reason)
      } else {
        reject('reason is empty')
      }
    });
  }

  /*获取模块的名称*/
  public getName(): string {
    return 'RNRestart';
  }
}