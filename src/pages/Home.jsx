import React from 'react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import './styles/Home.css'


function Home() {
  return (
    <div>
        <Navbar></Navbar>
        <div className='home-container'>
            <div className='left-home'>
                <h1><strong>WUP</strong>SCHOLARSHIP</h1>
                <Button to='/student' text='STUDENT / APPLICANT'/>
                <Button to='/dean' text='COLLEGE DEAN'/>
                <Button to='/admin' text='ADMINISTRATOR'/>
                <div className="contact-info">
                    <p>Mabini Extension, Cabanatuan City,</p>
                    <p>Nueva Ecija, 3100, Philippines</p>
                    <p>+63 (044) 463-2162 / 463-2074</p>
                </div>
            </div>
            <div className='right-home'>
                <h2>ANNOUNCEMENT: </h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque, iusto veniam aut accusamus aliquid possimus explicabo rem hic accusantium eaque, enim nulla quasi recusandae blanditiis expedita adipisci commodi! Numquam iure harum impedit pariatur fugit earum voluptates suscipit asperiores necessitatibus voluptate eveniet similique totam iste quis alias at tempore, ad dignissimos illum labore fuga assumenda. Pariatur sint error voluptas, maiores alias itaque corporis nesciunt voluptatem laboriosam modi unde. Aspernatur magni sit incidunt magnam ratione vel, veritatis libero quam blanditiis, perferendis porro officia deserunt soluta, harum quibusdam! Dignissimos obcaecati culpa eos sunt nulla, tenetur minus cupiditate alias fugit, ut cumque velit fugiat rerum molestias nesciunt incidunt quisquam harum aut sapiente similique suscipit iure soluta! Molestias repellendus dicta quod distinctio, error fugit sint pariatur eveniet porro. Mollitia autem velit magnam alias. Natus, illo ab sint earum eius odio fugit asperiores incidunt eos excepturi rem sit iusto consequatur, quae ea quia quod voluptas quam vitae. Delectus fugiat aliquid suscipit hic quod tempora sint dolorem, consequuntur dignissimos animi nulla impedit maxime nemo corporis maiores eius porro doloremque ut cum rerum autem, iste aperiam. Ex, ab neque incidunt laboriosam esse impedit asperiores pariatur aliquam? Vel perspiciatis nulla magnam exercitationem, itaque similique totam voluptatem qui voluptas, nam, rerum enim nihil? Facere vero porro praesentium eos molestiae ratione veniam quo, sapiente modi ipsa. Facilis qui voluptatibus eum sequi saepe consequuntur labore explicabo! Quasi soluta blanditiis, necessitatibus similique inventore cupiditate omnis eveniet itaque consequuntur praesentium sequi nulla ratione ullam pariatur reiciendis temporibus suscipit culpa dolores fugiat rem sunt velit ad! Nostrum pariatur saepe, architecto asperiores eum sint rem sapiente odio eligendi molestias deserunt, veritatis molestiae mollitia quod, expedita tempora provident! Ducimus perferendis eum esse voluptate error doloribus sit quaerat neque sunt, accusamus aspernatur quo porro nesciunt dolore. Dolorem repellendus molestiae eos optio laboriosam sint provident aliquid voluptate quod cum.</p>
            </div>
        </div>
    </div>
  )
}

export default Home