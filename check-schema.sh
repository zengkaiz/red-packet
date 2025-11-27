#!/bin/bash

echo "=== Step 1: Get all types in the schema ==="
curl -s -X POST https://api.studio.thegraph.com/query/1715990/logstore/v0.0.3 \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name } } }"}' | \
  python3 -c "import json, sys; data = json.load(sys.stdin); types = [t['name'] for t in data['data']['__schema']['types'] if 'RedPacket' in t['name']]; print('\n'.join(types))"

echo ""
echo "=== Step 2: Check Query type fields for red packets ==="
curl -s -X POST https://api.studio.thegraph.com/query/1715990/logstore/v0.0.3 \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __type(name: \"Query\") { fields { name args { name type { kind ofType { name } } } } } }"}' | \
  python3 -c "
import json, sys
data = json.load(sys.stdin)
fields = data['data']['__type']['fields']
for f in fields:
    if 'redPacket' in f['name']:
        args = [a['name'] for a in f['args']]
        print(f'{f[\"name\"]}: args={args}')
"

echo ""
echo "=== Step 3: Test the correct query ==="
curl -s -X POST https://api.studio.thegraph.com/query/1715990/logstore/v0.0.3 \
  -H "Content-Type: application/json" \
  -d '{"query":"{ redPacketStats_collection(first: 1) { id redPacketId } }"}' | \
  python3 -m json.tool
