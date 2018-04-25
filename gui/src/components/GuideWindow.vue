<template lang="pug">
  window.guide(:hook="hook" width="700px")
    .big(slot="title")
      em guide
      img.logo(src="../assets/logo.svg")
    div(slot="content")
      scroller.info-panel
        ul.info-bar
          li
            .name Status
            .value Pre-release
          li
            .name Guides
            .value 18
          li
            .name Contributors
            .value 4
      .padding.pv-30
        scroller(style="height: 512px")
          h1 Digital Assets
          p Digital assets are programmable assets that exist in the form of electronic data. With blockchain technology, the digitization of assets can be decentralized, trustful, traceable, highly transparent, and free of intermediaries. On the NEO blockchain, users are able to register, trade, and circulate multiple types of assets. Proving the connection between digital and physical assets is possible through digital identity. Assets registered through a validated digital identity are protected by law.
          p NEO has two forms of digital assets: global assets and contract assets. Global assets can be recorded in the system space and can be identified by all smart contracts and clients. Contract assets are recorded in the private storage area of the smart contract and require a compatible client to recognize them. Contract assets can adhere to certain standards in order to achieve compatibility with most clients.
          h1 Digital Identity
          p Digital identity refers to the identity information of individuals, organizations, and other entities that exist in electronic form. The more mature digital identity system is based on the PKI (Public Key Infrastructure) X.509 standard. In NEO, we will implement a set of X.509 compatible digital identity standards. This set of digital identity standards, in addition to compatible X.509 level certificate issuance model, will also support Web Of Trust point-to-point certificate issuance model. Our verification of identity when issuing or using digital identities includes the use of facial features, fingerprint, voice, SMS and other multi-factor authentication methods. At the same time, we will also use the blockchain to replace the Online Certificate Status Protocol (OCSP) to manage and record the X.509 Certificate Revocation List (CRL).
          h1 Smart Contract
          p The smart contract was first proposed by the cryptographer Nick Szabo in 1994, only five years after the creation of the World Wide Web. According to Szabo's definition: When a pre-programmed condition is triggered, the smart contract will execute the corresponding contract terms. Blockchain technology provides us with a decentralized, tamper-resistant, highly reliable system in which smart contracts are very useful. NEO has an independent smart contract system: NeoContract.
          p The NeoContract smart contract system is the biggest feature of the seamless integration of the existing developer ecosystem. Developers do not need to learn a new programming language but use C#, Java and other mainstream programming languages in their familiar IDE environments (Visual Studio, Eclipse, etc.) for smart contract development, debugging and compilation. NEO's Universal Lightweight Virtual Machine, NeoVM, has the advantages of high certainty, high concurrency, and high scalability. The NeoContract smart contract system will allow millions of developers around the world to quickly carry out the development of smart contracts. NeoContract will have a separate white paper describing the implementation details.
          h1 Application and Ecosystem
          p Ecosystem is the vitality of the open source community. In order to achieve the goal of an intelligent economic network, NEO will be committed to the development of its ecosystem, providing mature development tools, improving development of documents, organizing education and training activities, and providing financial support. We plan to support the following NEO-based applications and ecology and to reward improvements to the design of the experience:
</template>

<script>
export default {
  name: 'GuideWindow',
  props: {
    hook: {
      type: String,
      required: true
    }
  }
}
</script>
