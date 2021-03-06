/**
 * Copyright (c) 2016 Nishant Das Patnaik.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
**/

'use strict';

var s1 = '';
var s2 = '';

// Man Page: http://man7.org/linux/man-pages/man2/open.2.html

Interceptor.attach(Module.findExportByName('libc.so', 'strcmp'), {
  onEnter: function(args) {
    s1 = Memory.readUtf8String(args[0]);
    s2 = Memory.readUtf8String(args[1]);
  },
  
  onLeave: function(retval) {
    /*   --- Payload Header --- */
    var send_data = {};
    send_data.time = new Date();
    send_data.txnType = 'syscall';
    send_data.lib = 'libc.so';
    send_data.method = 'strcmp';
    send_data.artifact = [];
    
    /*   --- Payload Body --- */
    var data = {};
    data.name = "s1";
    data.value = s1;
    data.argSeq = 1;
    send_data.artifact.push(data);
    
    /*   --- Payload Body --- */
    var data = {};
    data.name = "s2";
    data.value = s2;
    data.argSeq = 2;
    send_data.artifact.push(data);

    /*   --- Payload Body --- */
    var data = {};
    data.name = "Status";
    var ret = retval.toInt32() === 0 ? "Same" : retval.toInt32() >0 ? "Greater" : "Smaller";
    data.value = ret;
    data.argSeq = 0;
    send_data.artifact.push(data);

    send(JSON.stringify(send_data));
  }
});
