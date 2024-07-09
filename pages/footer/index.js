import { AcmeLogo1 } from './svg'
import Styles from './index.module.css'
import Image from 'next/image';
import myGif from './home.gif'

export default function () {
    return (
        <>
            <footer class="bg-dark text-white text-center py-3">
                <div class="container">
                    <p>&copy; 2024 GoBikes. All rights reserved.</p>
                </div>
            </footer>
        </>
    )
}