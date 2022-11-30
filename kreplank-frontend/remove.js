
let obj = {
    "_id": "44f43f39d40628cab82b3ea3f6b31440b9008f0f841426e40739da4b431df9f1",
    "created": "2020-12-29T12:51:24.560322Z",
    "state": "APPROVED",
    "step": "COMPANY_DONE",
    "address": {
        "country": "AR",
        "address1": "a",
        "address2": "a",
        "city": "a",
        "postalCode": "a",
        "created": "2020-12-29T12:52:53.762427Z",
        "photo": "kanga-kyc/44f43f39d40628cab82b3ea3f6b31440b9008f0f841426e40739da4b431df9f1/8c710478-857f-4be8-868a-fcae8e3e8b8f.png"
    },
    "modified": "2020-12-29T13:34:48.910190Z",
    "personal": {
        "name": "a",
        "name2": "a",
        "surname": "a",
        "dateOfBirth": "1925-08-19T00:00:00Z",
        "country": "AR",
        "created": "2020-12-29T12:51:34.393966Z"
    },
    "identification": {
        "country": "AR",
        "docType": "PASSPORT",
        "created": "2020-12-29T12:51:48.024939Z",
        "photos": [
            "kanga-kyc/44f43f39d40628cab82b3ea3f6b31440b9008f0f841426e40739da4b431df9f1/4e2727dc-8b35-4d56-a1e1-e549e443ca7b.png"
        ]
    },
    "rejectedSteps": [

    ],
    "company": {
        "details": {
            "country": "AG",
            "name": "a",
            "govUrl": "a",
            "number": "a",
            "vat": "",
            "note1": "a",
            "note2": "",
            "note3": "",
            "modified": "2020-12-29T13:34:48.910190Z"
        },
        "modified": "2020-12-29T13:40:11.109096Z",
        "state": "APPROVED",
        "shareholders": {
            "items": [
                {
                    "email": "a",
                    "shares": 0,
                    "votes": 0
                }
            ],
            "modified": "2020-12-29T13:34:58.164919Z"
        },
        "attachment0": {
            "type": "residency",
            "state": "APPROVED",
            "modified": "2020-12-29T13:39:57.985620Z",
            "url": "kanga-kyc/44f43f39d40628cab82b3ea3f6b31440b9008f0f841426e40739da4b431df9f1/a9a9bf67-8827-420c-8b37-ce957d36c62d.png"
        },
        "attachment1": {
            "type": "articles",
            "state": "APPROVED",
            "modified": "2020-12-29T13:40:03.227756Z",
            "url": "kanga-kyc/44f43f39d40628cab82b3ea3f6b31440b9008f0f841426e40739da4b431df9f1/b3f6449c-57b8-48c5-80c2-d52718708083.png"
        },
        "attachment2": {
            "state": "APPROVED"
        },
        "attachment3": {
            "type": "authorization",
            "state": "APPROVED",
            "modified": "2020-12-29T13:40:10.827385Z",
            "url": "kanga-kyc/44f43f39d40628cab82b3ea3f6b31440b9008f0f841426e40739da4b431df9f1/6d687194-0bcd-48fa-afd1-b051773a3ec3.png"
        }
    },
    "email": "p.budziszewski@grupait.com"
}


const userKycParser = (obj) => {
    if (!obj)
        return Array(10).fill('')

    const { items, modified: modifiedHolders } = obj.company?.shareholders
    const shareholdersItemsArray = items.reduce((acc, it) => acc + [it.email, it.shares, it.votes], [])

    const { personal: aaa, address: { street, } } = obj;

    return [
        obj.email, obj.step, obj.state, obj.code, obj.created, obj.modified, obj.onHold, obj.rejectedSteps, obj.personal?.name,
        obj.personal?.name2, obj.personal?.surname, obj.personal?.dateOfBirth, obj.personal?.country, obj.personal?.created,
        obj.personal?.idNumber, obj.identification?.docType, obj.identification?.created, obj.identification?.country, obj.address?.country,
        obj.address?.city, obj.address?.address1, obj.address?.address2, obj.address?.postalCode, obj.address?.created, obj.additional?.code,
        obj.additional?.created, obj.additional?.forced, obj.company?.state, obj.company?.modified, obj.company?.details?.modified,
        obj.company?.details?.name, obj.company?.details?.country, obj.company?.details?.number, obj.company?.details?.vat,
        obj.company?.details?.note1, obj.company?.details?.note2, obj.company?.details?.note3, obj.company?.attachment0?.state,
        obj.company?.attachment0?.type, obj.company?.attachment0?.modified, obj.company?.attachment1?.state, obj.company?.attachment1?.type,
        obj.company?.attachment1?.modified, obj.company?.attachment2?.state, obj.company?.attachment2?.type, obj.company?.attachment2?.modified,
        obj.company?.attachment3?.state, obj.company?.attachment3?.type, obj.company?.attachment3?.modified, obj.fallbackCountry, obj.pep?.refersTp,
        obj.pep?.awarness, obj.pep?.created, shareholdersItemsArray, modifiedHolders
    ]
        .filter(it => (it != null && it != undefined && it != "" && it != []))
}