/*
 speakerbit package
*/
 //% weight=100 icon="\ue952" color=#006000
namespace speakerbit {

    export enum SpeakerSerialPin {
        //% block="P0"
        P0 = EventBusSource.MICROBIT_ID_IO_P0,
        //% block="P1"
        P1 = EventBusSource.MICROBIT_ID_IO_P1,
        //% block="P2"
        P2 = EventBusSource.MICROBIT_ID_IO_P2,
        //% block="P8"
        P8 = EventBusSource.MICROBIT_ID_IO_P8,
        //% block="P12"
        P12 = EventBusSource.MICROBIT_ID_IO_P12,
        //% block="P13"
        P13 = EventBusSource.MICROBIT_ID_IO_P13,
        //% block="P14"
        P14 = EventBusSource.MICROBIT_ID_IO_P14,
        //% block="P15"
        P15 = EventBusSource.MICROBIT_ID_IO_P15,
        //% block="P16"
        P16 = EventBusSource.MICROBIT_ID_IO_P16
    };
/**
   * Speakerbit board initialization,set microbit serialpin, please execute at start time
   * @param tx the new transmission pin, eg: SpeakerSerialPin.P0
   * @param rx the new reception pin, eg: SpeakerSerialPin.P1
  */
 //% weight=98
 //% blockId=SpeakerbitInit block="Speakerbit serial|TX %tx|RX %rx|"
 //% blockExternalInputs=1
 //% tx.fieldEditor="gridpicker" tx.fieldOptions.columns=3
 //% tx.fieldOptions.tooltips="false"
 //% rx.fieldEditor="gridpicker" rx.fieldOptions.columns=3
 //% rx.fieldOptions.tooltips="false"
 //% blockGap=8
  export function SpeakerbitInit(tx:SpeakerSerialPin, rx:SpeakerSerialPin) {
  serial.redirect(
     tx,
     rx,
     BaudRate.BaudRate9600);
    control.waitMicros(50);

    basic.forever(() => {
      getMp3Cmd();
      });
  }
   
    /**
     * Control the Speakerbit play current music,default is the first music
     */
    //% weight=96
    //% blockId=PlayMusic block="Play music"
    export function PlayMusic()
    {
        serial.writeString("|PLAY$");
    }
    
    /**
     * Pause the current playing music
     */
    //% weight=95
    //% blockId=Pause block="Pause music"
    export function Pause()
    {
        serial.writeString("|PAUSE$");
    }

    /**
     * Stop the current playing music
     */
    //% weight=94
    //% blockId=Stop block="Stop music"
    export function Stop()
    {
        serial.writeString("|STOP$");
    }

    /**
     * Play the previous music
     */
    //% weight=92
    //% blockId=PlayPrevious block="Play previous music"
    export function PlayPrevious()
    {
        serial.writeString("|PREV$");
    }

    /**
     * Play the next music
     */
    //% weight=90
    //% blockId=PlayNext block="Play next music"
    export function PlayNext()
    {
        serial.writeString("|NEXT$");
    }

    /**
     * Play the select music,num ranges for 1 to 999
     */
    //% weight=88
    //% blockId=PlaySelect block="Play music number %index"
    export function PlaySelect(index: number)
    {
        let str: string = "|PLAY";
        str += index.toString();
        str += "$";
        serial.writeString(str);
    }

    /**
     * Read the speakerbit all musics'name
     */
    //% weight=86
    //% blockId=ReadName block="Get speakerbit music name list"
    export function ReadName()
    {
        serial.writeString("|NAME$");
    }

    /**
     * Set speakerbit volume level,range for 0 to 10
     */
    //% weight=84
    //% blockId=SetVolume block="Set the speakerbit volume %index"
    //% index.min=0 index.max=10
    export function SetVolume(index: number)
    {
        let str: string = "|VOL";
        str += index.toString();
        str += "$";
        serial.writeString(str);
    }

    /**
     * Set speakerbit volume up
     */
    //% weight=82
    //% blockId=VolumeUp block="Set the speakerbit volume up"
    export function VolumeUp()
    {
        serial.writeString("|VOL+$");
    }

    /**
     * Set speakerbit volume down
     */
    //% weight=80
    //% blockId=VolumeDown block="Set the speakerbit volume down"
    export function VolumeDown()
    {
        serial.writeString("|VOL-$");
    }

    let mp3Cmd: string = "";
    /**
     * Get the mp3 command.
     */
    function getMp3Cmd() {
        let charStr: string = serial.readString();
        mp3Cmd = mp3Cmd.concat(charStr); 
        let cnt: number = countChar(mp3Cmd, "$");
        let startIndex: number = 0;
        if (cnt == 0)
            return;  
        for (let i = 0; i < cnt;i++)
        {
            let index = findIndexof(mp3Cmd, "$", startIndex);
            if (index != -1) {
                let cmd: string = mp3Cmd.substr(startIndex, index - startIndex);
            }  
            
        }    
        if (cnt > 0)
        {
            mp3Cmd = "";
        }    
    }

    function findIndexof(src: string,strFind: string,startIndex: number): number
    {
        for (let i = startIndex; i < src.length; i++)
        {
            if (src.charAt(i).compare(strFind) == 0)
            {
                return i;
            }    
        }  
        return -1;
    }

    function countChar(src: string, strFind: string): number {
        let cnt: number = 0;
        for (let i = 0; i < src.length; i++)
        {
            if (src.charAt(i).compare(strFind) == 0)
            {
                cnt++;
            }
        }
        return cnt;
    }

    function strToNumber(str: string): number {
        let num: number = 0;
        for (let i = 0; i < str.length; i++)
        {
            let tmp: number = converOneChar(str.charAt(i));
            if (tmp == -1)
                return -1;    
            if (i > 0)
                num *= 16;    
            num += tmp;
        }    
        return num;
    }

    function converOneChar(str: string): number {
        if (str.compare("0") >= 0 && str.compare("9") <= 0) {
            return parseInt(str);
        }
        else if (str.compare("A") >= 0 && str.compare("F") <= 0) {
            if (str.compare("A") == 0) {
                return 10;
            }
            else if (str.compare("B") == 0) {
                return 11;
            }
            else if (str.compare("C") == 0) {
                return 12;
            }
            else if (str.compare("D") == 0) {
                return 13;
            }
            else if (str.compare("E") == 0) {
                return 14;
            }
            else if (str.compare("F") == 0) {
                return 15;
            }
            return -1;  
        }
        else
            return -1; 
    }    
}
