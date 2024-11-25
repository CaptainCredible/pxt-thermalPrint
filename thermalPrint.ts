/**
* Makecode block for thermal printer
*/

namespace thermalPrint {


    let heatTime: number
    heatTime = 80          //80 is default. Controls speed of printing and darkness
    let heatInterval: number
    heatInterval = 2      //2 is default. Controls speed of printing and darkness
    let printDensity: number
    printDensity = 15       //Not sure what the defaut is. Testing shows the max helps darken text. From page 23.
    let printBreakTime: number
    printBreakTime = 15     //Not sure what the defaut is. Testing shows the max helps darken text. From page 23.

    export enum bgColor {

        //%block="White"
        White = 0,
        //%block="Black"
        Black = 1
    }

    export enum textBold {

        //%block="Off"
        Off = 0,
        //%block="On"
        On = 1
    }


    export enum textAlignment {

        //%block="Left"
        Left = 48,
        //%block="Centre"
        Centre = 49,
        //%block="Right"
        Right = 50
    }

    export enum textunderline {

        //%block="Off"
        Off = 48,
        //%block="Light"
        Light = 49,
        //%block="Dark"
        Dark = 50
    }

    /**
     * Initialize Thermal Printer
     * @param Configure pin for serial communication
     */
    
    //% blockId="ThermalPrinter_setSerial" block="Connect printer RX to %pinRX|TX to %pinTX with baudrate %baudrate"
    //% weight=100 blockExternalInputs=true blockGap=3
    //% baudrate.defl=9600
    export function thermal_printer_setSerial(pinRX: SerialPin, pinTX: SerialPin, baudrate: BaudRate): void {

        serial.redirect(
            pinRX,
            pinTX,
            baudrate
        )
        basic.pause(100)
    }

    /**
     * Print string and line feed
     * @param s is string to be printed, eg: "Hello"
     */
    //% blockId="ThermalPrinter_printString" block="Print string %s"
    //% weight=98 blockGap=3
    export function printString(s: string): void {
        let dataBuffer = pins.createBuffer(1)
        serial.writeString(s)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 10) //line feed
        serial.writeBuffer(dataBuffer)
    }

    /**
     * Print number and line feed
     * @param num is number to be printed, eg: 123
     */
    
    //% blockId="ThermalPrinter_printNum" block="Print number %num"
    //% weight=97 blockGap=3
    export function printNum(num: number): void {
        let dataBuffer = pins.createBuffer(1)
        serial.writeNumber(num)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 10) //line feed
        serial.writeBuffer(dataBuffer)
    }


    /**
     * New Line
     * @param Sending line feed to the printer
     */
    
    //% blockId="ThermalPrinter_newLine" block="New line"
    //% weight=90 blockGap=20
    export function LineFeed(): void {
        let dataBuffer = pins.createBuffer(1)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 10) //send LF
        serial.writeBuffer(dataBuffer)
    }

    /**
     * Reset printer
     */
    
    //% blockId="ThermalPrinter_resetPrint" block="Reset printer"
    //% weight=20 blockGap=3
    export function resetPrinter(): void {
        let dataBuffer = pins.createBuffer(2)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 27)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 64)
        serial.writeBuffer(dataBuffer)
    }



    /**
      * Align text to left, centre or right
      */
     
    //% blockId="ThermalPrinter_textAlign" block="Text align to %textAlign"
    //% weight=84 blockGap=3
    export function setTextAlign(textAlign: textAlignment) {
        let ptextAlign: number
        ptextAlign = textAlign

        let dataBuffer = pins.createBuffer(3)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 27)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 97)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 2, ptextAlign)

        serial.writeBuffer(dataBuffer)

    }

    /**
     * Print underline.
     */
     
    //% blockId="ThermalPrinter_underLine" block="Underline %underlineText"
    //% weight=87 blockGap=3
    export function setUnderLine(underlineText: textunderline) {
        let punderlineText: number
        punderlineText = underlineText

        let dataBuffer = pins.createBuffer(3)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 27)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 45)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 2, punderlineText)

        serial.writeBuffer(dataBuffer)

    }

    /**
     * Set text background color to white/black
     */
     
    //% blockId="ThermalPrinter_backGroundColor" block="Set text background to  %backgroundColor"
    //% weight=82 blockGap=20
    export function backGroundColor(backgroundColor: bgColor) {
        let pBackgroundColor: number
        pBackgroundColor = backgroundColor

        let dataBuffer = pins.createBuffer(3)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 29)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 66)

        if (pBackgroundColor === bgColor.White) {
            dataBuffer.setNumber(NumberFormat.UInt8LE, 2, 0)
        } else {
            dataBuffer.setNumber(NumberFormat.UInt8LE, 2, 1)
        }
        serial.writeBuffer(dataBuffer)

    }

    /**
     * Set bold On/Off
     */
     
    //% blockId="ThermalPrinter_setTextBold" block="Bold %boldText"
    //% weight=89 blockGap=3
    export function setTextBold(boldText: textBold) {
        let pboldText: number
        pboldText = boldText

        let dataBuffer = pins.createBuffer(3)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 27)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 69)

        if (pboldText === textBold.Off) {
            dataBuffer.setNumber(NumberFormat.UInt8LE, 2, 0)
        } else {
            dataBuffer.setNumber(NumberFormat.UInt8LE, 2, 1)
        }
        serial.writeBuffer(dataBuffer)

    }

    /**
     * Set Character size. Default value: 0,0
     * @param Width is to set character width, eg: 0
     * @param Height is to set character height, eg: 0
     */
     
    //% blockId="ThermalPrinter_setCharacterSize" block="Set character size width %Width| height %Height"
    //% weight=85 blockExternalInputs=true blockGap=3
    //% Width.min=0 Width.max=4
    //% Height.min=0 Height.max=4
    export function setCharacterSize(Width: number, Height: number): void {
        let pWidth: number
        pWidth = Width
        let pHeight: number
        pHeight = Height
        let pSize: number
        pSize = pWidth << 4
        pSize = pSize | pHeight

        let dataBuffer = pins.createBuffer(3)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 29)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 33)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 2, pSize)

        serial.writeBuffer(dataBuffer)
    }
}