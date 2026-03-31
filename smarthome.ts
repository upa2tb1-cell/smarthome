namespace SmartHome {

    let temp = 0
    let hum = 0
    let gas = 0

    export function init() {

    Acebott.LCD1602_Init()
    Acebott.RFID_init()
        // ===== BLUETOOTH COMMAND =====
export function onBluetoothCommand() {

    bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {

        let cmd = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))

        if (cmd == "LED_ON") {
            pins.digitalWritePin(DigitalPin.P1, 1)
        }

        if (cmd == "LED_OFF") {
            pins.digitalWritePin(DigitalPin.P1, 0)
        }
    })
}

    // ✅ BẮT BUỘC cho Bluetooth
    bluetooth.startUartService()
    bluetooth.startDeviceInformationService()

    // giúp tín hiệu mạnh hơn
    bluetooth.setTransmitPower(7)

    basic.showIcon(IconNames.Happy)
}

    export function readDHT() {
        temp = Acebott.DHT11_getvalue(DigitalWritePin.P8, DHT11Type.Temperature_C)
        hum = Acebott.DHT11_getvalue(DigitalWritePin.P8, DHT11Type.Humidity)

        Acebott.LCD1602_ShowString(0, 0, "T:")
        Acebott.LCD1602_ShowNumber(2, 0, temp)

        Acebott.LCD1602_ShowString(7, 0, "H:")
        Acebott.LCD1602_ShowNumber(9, 0, hum)

        bluetooth.uartWriteLine("T:" + temp + " H:" + hum)
    }

    export function readGas() {
        gas = Acebott.MQ4_Sensor(AnalogReadPin.P2)

        Acebott.LCD1602_ShowString(0, 1, "G:")
        Acebott.LCD1602_ShowNumber(2, 1, gas)

        bluetooth.uartWriteLine("G:" + gas)

        if (gas > 300) {
            music.playTone(262, 100)
        }
    }

    export function isMotion(): boolean {
        return Acebott.PIRMotion(DigitalPin.P0) == 1
    }

    export function readRFID() {
        if (Acebott.RFID_getID() != 0) {
            Acebott.LCD1602_ShowString(6, 1, "Hello")
            music.playTone(523, 100)
            bluetooth.uartWriteLine("RFID OK")
        }
    }

    export function onBluetooth() {
        bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
            let cmd = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))

            if (cmd == "LED_ON") {
                pins.digitalWritePin(DigitalPin.P1, 1)
            }

            if (cmd == "LED_OFF") {
                pins.digitalWritePin(DigitalPin.P1, 0)
            }
        })
    }
}
